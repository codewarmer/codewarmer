var phantom = require('phantom'),
url = require('url'),
mongoose = require('mongoose'),
url_model = mongoose.model('Url');

var scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var stripScriptTags = function(html) {
  return html.replace(scriptTagRegex,'');
}

var baseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/' : 'http://www.codewarmer.com/';

function saveSnapshot(data) {
	data.html = stripScriptTags(data.html);
	
	data.date = new Date();
	url_model.update({'uri': data.uri}, data, {upsert: true}, function(err,affected,raw) {
		if(err)
			console.log(err);
	});
}

function crawlSite(idx, arr, page, callback) {
	crawlUrl(arr[idx], page, function(data) {
		data.links.forEach(function(link) {
			if(arr.indexOf(link) < 0)
				arr.push(link);
		});
		saveSnapshot(data);

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

function exitPhantom(ph){
	ph.exit();
}

function crawlUrl(path, page, cb){
	uri = url.resolve(baseUrl, path);

	page.open(uri, function(status) {
		var evaluateCb = function(result) {
			result.uri = path;
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
			exitPhantom(ph);
			callback();
		});
	});
};

exports.crawlOne = function(path, callback) {
	startPhantom(function(ph,page) {
		crawlUrl(path, page, function(data) {
			saveSnapshot(data);
			exitPhantom(ph);
			callback();
		});
	});
};
