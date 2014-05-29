/**
 * Module dependencies
 */

var should = require('should'),
app = require('../../../server'),
mongoose = require('mongoose'),
Contact = mongoose.model('Contact');

describe('<Unit test>', function () {
  describe('Model Contact', function () {

    before(function (done) {
      message1 = new Contact({
        subject: 'Test1',
        text: 'TestBody1'
      });
      message2 = new Contact({
        subject: 'Test2',
        text: ''
      });
      message3 = new Contact({
        subject: '',
        text: 'TestBody3'
      });
      done();
    });

    it('Should begin with no contact messages', function (done) {
      Contact.find({}, function (err,messages) {
        messages.should.have.length(0);
        done();
      });
    });

    it('Should be able to save without problems', function (done) {
      message1.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('Should be able to show an error when try to save with no text', function (done) {
      message2.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('Should be able to show an error when try to save with no subject', function (done) {
      message3.save(function (err) {
        should.exist(err);
        done();
      });
    });

    after(function () {
      Contact.remove().exec();
    });

  });
});
