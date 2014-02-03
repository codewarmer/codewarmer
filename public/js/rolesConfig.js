(function(exports){
	//Roles
	exports.roles = ['user', 'admin'];
	//Access
	exports.access = {
			'auth': ['user','admin'],
			'admin': ['admin']
	};
})(typeof exports === 'undefined' ? this['rolesConfig'] = {} : exports);
