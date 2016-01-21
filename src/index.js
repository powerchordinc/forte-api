import ApiClient from './client'
import { InvalidArgumentError, ApiPaths } from './util'

exports = module.exports = createApi

const DEFAULTS = {
	url: 'https://api.powerchord.io',
	fingerPrintingEnabled: true
}

function createApi(credentials, scope, options) {
	validateArgs('createApi', arguments)
	let opts = {...DEFAULTS, ...options}
	return forteApi(credentials, scope, opts)
}

function forteApi(credentials, scope, options) {
	let authToken;
	let client = new ApiClient(scope.hostname, credentials, options.url, (err, response) => {
		eventRegistry.auth.forEach((cb => cb(err, response)))
	});

	let eventRegistry = {
		auth: []
	}

	return {
		withBranch(id) {
			validateArgs('withBranch', arguments)

			let newScope = {...scope, ...{ branch: id}}
			return createApi(credentials, newScope, options)
		},
		getScope(){
			return scope
		}, 
		on(name, callback) {
			validateArgs('on', arguments)
			eventRegistry[name].push(callback)
		},
		log(level, message, meta) {
			validateArgs('log', arguments) 
			return client.post(ApiPaths.log, { data: { level, message, meta } })
		},
		organizations: {
			getMany(filter){
				validateArgs('organizations_getMany', arguments)
				return client.get(ApiPaths.organizations.getMany(filter))
			},
			getOne(id){
				validateArgs('organizations_getOne', arguments)
				return client.get(ApiPaths.organizations.getOne(id))
			}
		}

	}
}

/* 
 * method validations
 */
const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

function argumentError(name) {
	throw new InvalidArgumentError(name)
}

function validateArgs(method, args) {
	// TODO, add NODE_ENV='production' check here so we can skip validation in production mode
	validators[method].apply(null, args)
}

function isEmptyObject(obj){
	return !obj || typeof obj !== 'object' || Object.keys(obj).length === 0
}

function isInvalidString(obj) {
	return typeof obj !== 'string' || obj.trim() === ''
}

const validators = {
	createApi(credentials, scope, options) {
		function verifyCredentials(credentials) {
			if(!credentials){
				argumentError('credentials')
			}

			if(credentials.bearerToken !== undefined) {
				if(typeof credentials.bearerToken !== 'string'){
					argumentError('credentials.bearerToken')
				}
				return
			}

			if(typeof credentials.privateKey !== 'string'){
				argumentError('credentials.privateKey')
			}

			if(typeof credentials.publicKey !== 'string'){
				argumentError('credentials.publicKey')
			}
		}

		function verifyScope(scope) {
			if(!scope){
				throw new InvalidArgumentError('scope')
			}
			
			if(typeof scope.hostname !== 'string' || scope.hostname === ''){
				argumentError('scope.hostname')
			}

			if(typeof scope.trunk !== 'string' || scope.trunk === ''){
				argumentError('scope.trunk')
			}

			if(scope.branch !== undefined && typeof scope.branch !== 'string' || scope.branch === ''){
				argumentError('scope.branch')
			}
		}

		function verifyOptions(options) {
			// note: undefined is supported as options are merged with defaults in createApi

			if(options.url !== undefined && typeof options.url !== 'string') {
				argumentError('options.url')
			}

			if(options.fingerPrintingEnabled !== undefined && typeof options.fingerPrintingEnabled !== 'boolean') {
				argumentError('options.fingerPrintingEnabled')
			}
		}

		verifyCredentials(credentials)
		verifyScope(scope)
		verifyOptions(options)
	},
	withBranch(id) {
		if(id === undefined){
			throw new InvalidArgumentError('id')
		}
	},
	log(level, message, meta) {
		if(LOG_LEVELS.indexOf(level) === -1) {
			argumentError('Log level "' + level + '" is invalid. Use one of: ' + LOG_LEVELS.join(', '))
		}

		if(typeof message !== 'string' || message.trim() === '') {
			argumentError('Message "' + message + '" is invalid.')
		}

		if(meta !== undefined && (meta === null || typeof meta !== 'object')){
			argumentError('Meta "' + meta + '" is invalid.')
		}
	},
	on(name, callback) {
		if(name !== 'auth') {
			argumentError('"' + name + '" is not a supported event.')
		}

		if(typeof callback !== 'function') {
			argumentError('callback must be a function.')
		}
	},
	organizations_getMany(filter) {
		if(isEmptyObject(filter)) {
			argumentError('filter')
		}
	},
	organizations_getOne(id) {
		if(isInvalidString(id)) {
			argumentError('id')
		}
	}
}
