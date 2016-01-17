var assert = require('chai').assert
var forteApi = require('../src')
var assign = require('../src/util').assign

describe('forteApi', function(){
	function apiFactory(){
		var args = arguments
		return function() { 
			return forteApi.apply(null, args)
		}
	}

	var validTokenCreds = {bearerToken: 'valid'}
	var validKeyCreds = {privateKey: 'valid', publicKey: 'valid'}
	var validTrunkScope = { trunk: 'valid' }
	var validTrunkAndBranchScope = { trunk: 'valid', branch: 'valid' }

	var invalidBranchScopes = [null, '', 1, {}, function(){}]

	describe('ctor(credentials, scope, options)', function(){
		it('should throw if invalid credentials have been provided', function(){
			var invalidCredentials = [
				undefined,
				null,
				{},
				{bearerToken: null},
				{bearerToken: 0},
				{privateKey: null, publicKey: null},
				{privateKey: 0, publicKey: 0},
				{privateKey: 'valid', publicKey: 0},
				{privateKey: 0, publicKey: 'valid'}
			]
			invalidCredentials.forEach(function(invalidCreds){
				assert.throws(apiFactory(invalidCreds, validTrunkScope))
			})
		})

		it('should NOT throw if valid credentials have been provided', function(){
			assert.doesNotThrow(apiFactory(validTokenCreds, validTrunkScope))
			assert.doesNotThrow(apiFactory(validKeyCreds, validTrunkScope))
		})

		it('should throw if an invalid a trunk scope has been provided', function(){
			assert.throws(apiFactory(validTokenCreds, undefined))
			assert.throws(apiFactory(validTokenCreds, null))
			assert.throws(apiFactory(validTokenCreds, {}))
		})

		it('should throw if an invalid a branch scope has been provided', function(){
			invalidBranchScopes.forEach(function(scope){
				assert.throws(apiFactory(validTokenCreds, {trunk:'valid', branch: scope}))
			})
		})

		it('should throw if options are invalid', function(){
			var invalidOptions = [
				{},
				{ url: 0 },
				{ fingerPrintingEnabled: 'invalid' },
				{ url: 'valid', fingerPrintingEnabled: 'invalid' },
				{ url: 0, fingerPrintingEnabled: true }
			]
			invalidOptions.forEach(function(options) {
				assert.throws(apiFactory(validTokenCreds, validTrunkScope, options))	
			})
		})

		it('should NOT throw if options are valid', function(){
			var validOptions = [
				undefined,
				{ url: 'valid' },
				{ fingerPrintingEnabled: true },
				{ url: 'valid', fingerPrintingEnabled: true },
			]
			validOptions.forEach(function(options) {
				assert.doesNotThrow(apiFactory(validTokenCreds, validTrunkScope, options))	
			})
		})
	})

	describe('.withBranch(id)', function(){
		var api
		var branchApi
		
		beforeEach(function(){
			api = apiFactory(validTokenCreds, validTrunkAndBranchScope)()
			branchApi = api.withBranch('branchid')
		})

		it('should throw when id is invalid', function(){
			invalidBranchScopes.concat(undefined).forEach(function(scope){
				assert.throws(function() { api.withBranch(scope) })
			})
		})

		it('should return a new instance with the correct scope', function(){
			assert.notStrictEqual(api, branchApi)
			assert.deepEqual(branchApi.getScope(), assign({}, validTrunkAndBranchScope, { branch: 'branchid'}))
		})

		it('should NOT alter the original api scope', function(){
			assert.deepEqual(api.getScope(), validTrunkAndBranchScope)
		})
	})

	describe('.on("auth", cb)', function(){
		it('should throw if callback is not a function')
		it('should invoke the callback function on auth success')
		it('should invoke the callback function on auth error')
	})

	describe('api.log', function(){
		it('should throw if log level is invalid')
		it('should throw if message is invalid')
		it('should throw if meta is supplied, but is not an object')
	})

	describe('api.organizations', function(){
		describe('.getMany', function(){
			it('should throw if filter is null')
			describe('when a request succeeds, the return value', function(){
				it('should have a "response" property')
				it('should have a "response.data" property')
			})
			describe('when a request fails, the return value', function(){
				it('should have a "response" property')
				it('should have a "result" property')
			})
		})
		describe('.getOne', function(){
			it('should throw if filter is null')

		})
	})
})