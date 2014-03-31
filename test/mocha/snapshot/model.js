/**
 * Module dependencies.
 */
var should = require('should'),
app = require('../../../server'),
mongoose = require('mongoose'),
Snapshot = mongoose.model('Snapshot');

//Globals
var snapshot;

describe('<Unit Test>', function() {
  describe('Model Snapshot:', function() {
		before(function(done) {
			snapshot = {
				path: '/some_path',
				date: new Date(),
				html: '<html><body>Hello World!</body></html>'
			};

			snapshot2 = {
				path: '/some_path',
				date: new Date(),
				html: '<html><body>Good bye World!</body></html>'
			};

			done();
		});

		describe('Method Upsert', function() {
			it('should begin with no snapshots', function(done) {
				Snapshot.find({}, function(err, snapshots) {
					snapshots.should.have.length(0);
					done();
				});
			});

			it('shold be able to save without problems', function(done) {
				Snapshot.upsert(snapshot, function(err) {
					should.not.exist(err);
					done();
				});
			});

			it('should update record with the same path', function(done) {
				Snapshot.upsert(snapshot, function(err) {
					should.not.exist(err);
					Snapshot.upsert(snapshot2, function(err) {
						should.not.exist(err);
						Snapshot.find({}, function(err,snapshots) {
							snapshots.should.have.length(1);
							snapshots[0].html.should.be.eql(snapshot2.html);
							done();
						});
					});
				});
			});
		});
		
		after(function(done) {
			Snapshot.collection.drop();
			done();
		});
	});
});
