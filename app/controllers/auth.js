var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    rolesConfig = require('../../public/js/rolesConfig'),
    recaptcha = require('../../utils/recaptcha');

module.exports = {
	create: function(req, res, next) {

		recaptcha.verify(req, function(success, errmsg) {
			var errors = [];
			if(!success){
				errors.push({path: 'recaptcha', message: errmsg});
				return res.send(400, {errors: errors});
			}
			var user = new User(req.body);

			user.provider = 'local';
			user.save(function(err) {
				//Error handling
				if (err) {
					//console.log(err);
					switch(err.code){
					case 11000:
					case 11001:
						errors.push({path:'name',message:'Username already exists'});
					}

					for(var i in err.errors){
						if(err.errors.hasOwnProperty(i))
							errors.push(err.errors[i]);
					}

					return res.send(400, {errors: errors});
				}
				//User saved, attempt to login
				req.logIn(user, function(err) {
					if (err) return next(err);
					return res.json(200, user);
				});
			});
		});


	},

	login: function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			//console.log('pass auth', err, user, '\n');
			if(err) return next(err);
			if(!user) return res.send(400, {errors: [info]});

			req.logIn(user, function(err) {
				if(err) return next(err);
				user.hashed_password = undefined;
				user.salt = undefined;
				res.json(200, user);
			});
		})(req, res, next);
	},

	logout: function(req,res) {
		req.logout();
		res.send(200);
	},

	checkAccess: function(access) {
		return function(req, res, next) {
			if(req.user && rolesConfig.access[access].indexOf(req.user.role)!==-1)
				next();
			else
				res.send(403);
		};
	},

	hasAccess: function(access, req) {
		return req.user && rolesConfig.access[access].indexOf(req.user.role)!==-1;
	}

};
