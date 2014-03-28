var phantom = require('phantom'),
url = require('url'),
mongoose = require('mongoose'),
Snapshot = mongoose.model('Snapshot');

var baseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/' : 'http://www.codewarmer.com/';

function crawlSite(idx, arr, page, callback) {
	crawlUrl(arr[idx], page, function(data) {
		data.links.forEach(function(link) {
			if(arr.indexOf(link) < 0)
				arr.push(link);
		});
		Snapshot.upsert(data);

		if(++idx === arr.length)
			callback();
		else
			crawlSite(idx, arr, page, callback);
	});
}

function startPhantom(cb){
	phantom.create(function(ph) {
		phInstance = ph;
		ph.createPage(function(page) {
			phPage = page;
			cb(ph, page);
		});
	});
}

function crawlUrl(path, page, cb){
	uri = url.resolve(baseUrl, path);

	page.open(uri, function(status) {
		var evaluateCb = function(result) {
			result.path = path;
			cb(result);
		};
		//@TODO: find a way how to check is page rendered
		setTimeout(function() {
			if(status=='success')
				page.evaluate(function() {
					var linkTags = document.querySelectorAll('a:not([rel="nofollow"])');
					var links = [];
					for(var i=0,ln; ln = linkTags[i]; i++)
						links.push(ln.getAttribute('href'));

				  return {'links': links,'html': document.documentElement.outerHTML};
				}, evaluateCb);
		},2000);
	});

}

exports.crawlAll = function(callback) {
	startPhantom(function(ph,page) {
		crawlSite(0, ['/'], page, function() {
			ph.exit();
			callback();
		});
	});
};

exports.crawlOne = function(path, callback) {
	startPhantom(function(ph,page) {
		crawlUrl(path, page, function(data) {
			Snapshot.upsert(data);
			ph.exit();
			callback();
		});
	});
};
