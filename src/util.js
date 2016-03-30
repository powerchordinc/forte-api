'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InvalidArgumentError = exports.ApiPaths = undefined;

var _querystring = require('querystring');

require('extend-error');

/*
ForteApi Routes

Locations:
getMany: 	/{service}/organizations/{trunk}/{branch}/locations/
getOne:	 	/{service}/organizations/{trunk}/{branch}/locations/{locationID}

Organizations:
getMany:	/organizations/
getOne:		/organizations/{branch}

Content:
getMany:	/{service}/{trunk}/{branch}/content/{resource_type}/
getOne:		/{service}/{trunk}/{branch}/content/{resource_type}/{id}

Composite:
query:		/composite

*/

var ApiPaths = exports.ApiPaths = {
	log: '/developer/log',
	experience: {
		session: function session() {
			return `/session/check`
		},
		bootstrap: function bootstrap(id) {
			return `/forte/bootstrap/${id}`
		}
	},
	organizations: {
		getMany: function getMany() {
			return '/organizations/';
		},
		getOne: function getOne(id) {
			return '/organizations/' + id;
		}
	},
	locations: {
		getMany: function getMany(scope) {
			return '/forte/organizations/' + scope.trunk + '/' + scope.branch + '/locations/';
		},
		getOne: function getOne(scope, id) {
			return '/forte/organizations/' + scope.trunk + '/' + scope.branch + '/locations/' + id;
		}
	},
	content: {
		getMany: function getMany(scope, type) {
			return '/forte/' + scope.trunk + '/' + scope.branch + '/content/' + type + '/';
		},
		getOne: function getOne(scope, type, id) {
			return '/forte/' + scope.trunk + '/' + scope.branch + '/content/' + type + '/' + id;
		}
	},
	composite: {
		query: function query(scope) {
			return '/forte/composite/' + scope.trunk + '/' + scope.branch + '/';
		}
	}
};

var InvalidArgumentError = exports.InvalidArgumentError = Error.extend('InvalidArgument');
