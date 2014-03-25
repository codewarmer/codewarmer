var phantom = require('phantom'),
url = require('url'),
mongoose = require('mongoose'),
url_model = mongoose.model('Url');

var scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var stripScriptTags = function(html) {
  return html.replace(scriptTagRegex,'');
}

var browserOpts = {
	waitFor: 5000,
	loadCSS: true,
	runScripts: true,
	userAgent: 'Zombie',
	windowName: 'nodejs',
	//silent: true
	debug: true
};

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
//var phInstance, phPage;

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
	// phInstance.exit();
	// phInstance = null;
	ph.exit();
}

function crawlUrl(path, page, cb){
	uri = url.resolve(baseUrl, path);

	page.open(uri, function(status) {
		page.evaluate(function() {
			var linkTags = document.querySelectorAll('a:not([rel="nofollow"])');
			var links = [];
			for(var i=0,ln; ln = linkTags[i]; i++)
				links.push(ln.getAttribute('href'));

			return {
				'links': links,
				'html': document.documentElement.outerHTML
			};
		}, function(result) {
			result.uri = path;
			cb(result);
			//ph.exit();
			//console.log('asd');
		});
		console.log('opened');
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
