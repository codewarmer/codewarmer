/**
 * Controller dependencies
 */

var mongoose = require('mongoose'),
Contact = mongoose.model('Contact'),
recaptcha = require('../../utils/recaptcha'),
config = require('../../config/config'),
nodemailer = require('nodemailer');

exports.create = function (req,res) {
  var contact = new Contact(req.body),
  errors = [],
  messages = [];

  recaptcha.verify(req, function (success, errmsg) {
    if(!success){
      errors.push({path: 'recaptcha', message: errmsg});
      return res.send(400,{errors: errors});
    }

    var smtpTransport = nodemailer.createTransport('SMTP', config.smtpRelay);

    var mailOptions = {
      from: 'Contact form on CodeWarmer.com',
      to: 'skorpva@gmail.com',
      subject: req.body.subject,
      text: req.body.text
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      }
      else {
        contact.sent = true;
        messages.push({message: 'Your message has been sent. Thank You.'});
        console.log("Message sent: " + response.message);
      }

      contact.save(function (err) {
        if(err){
          errors.push({message: 'Unknown server error, please try again later.'});
          return res.send(400, {'errors': errors});
        }
        else {
          return res.send(200, {'messages': messages});
        }
      });

      smtpTransport.close(); // shut down the connection pool, no more messages
    });
  });
};
