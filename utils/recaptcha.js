/**
 * Dependencies
 */

var Recaptcha = require('recaptcha').Recaptcha,
config = require('../config/config');

exports.verify = function (req, callback) {
  var data = {
    remoteip: req.connection.remoteAddress,
    challenge: req.body.recaptcha.challenge,
    response: req.body.recaptcha.response
  };

  var recaptcha = new Recaptcha(config.recaptcha.public_key, config.recaptcha.private_key, data);

  recaptcha.verify(function (success, error_code) {
    callback(success, msgFromError(error_code));
  });
};

function msgFromError(err_code) {
  switch(err_code){
    case 'incorrect-captcha-sol': return 'The CAPTCHA solution was incorrect.';
    case 'captcha-timeout': return 'The solution was received after the CAPTCHA time out.';
    default: return 'CAPTCHA error, please try again.';
  }
}
