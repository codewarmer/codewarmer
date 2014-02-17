var Browser = require('zombie'),
url = require('url'),
fs = require('fs'),
mongoose = require('mongoose'),
url_model = mongoose.model('Url'),
saveDir = __dirname + '/../public/snapshots';

var scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var stripScriptTags = function(html) {
  return html.replace(scriptTagRegex,'');
}

var browserOpts = {
	waitFor: 2000,
	loadCSS: true,
	ruenScripts: true,
	userAgent: 'Zombie',
	windowName: 'nodejs'
	//silent: true
	//debug: true
};

var baseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/' : 'http://www.codewarmer.com/';

function saveSnapshot(uri, body) {
	var path = url.parse(uri).pathname;
	//body = stripScriptTags(body);
	
	if(path === '/')
		path = '/index.html';

	if(path.indexOf('.html') === -1)
		path += '.html';

	saveUrl({'url': uri, 'path': path});

	var filename = saveDir + path;

	var filedir = filename.replace(/[^\/]*$/, '');

	fs.exists(filedir, function(exists) {
		if(exists)
			_save();
		else
			fs.mkdir(filedir, _save);
	});

	function _save(){
		fs.open(filename, 'w', function(e, fd) {
			if(e) {
				console.log(e);
				return;
			}
			fs.write(fd, body);
		});
	}
}

function crawlPage(idx, arr, callback) {
  if(idx < arr.length){
		var uri = arr[idx];
		console.log(uri);
		var browser = new Browser(browserOpts);
		var promise = browser.visit(uri).
			then(function() {
				//Turn links into absolute links
				// and save them, if we need to
				// and we haven't already crawled them
				var links = browser.queryAll('a:not([rel="nofollow"])');
				//if(idx>0) console.log(links);
				//var links = browser.queryAll('a');
				try{
				links.forEach(function(link) {
					var href = link.getAttribute('href');
					var absUrl = url.resolve(uri, href);
					link.setAttribute('href', absUrl);

					if(arr.indexOf(absUrl) < 0)
						arr.push(absUrl);
				});
				} catch(err){console.log(err);}
				//Save
				saveSnapshot(uri, browser.html());
				//Call again for next uri
				crawlPage(idx+1, arr, callback);
			}).
			fail(function(err) {
				console.log(err);
				callback(err);
			});
	}
	else{
		callback();
	}
}

function saveUrl(data, callback) {
	data.date = new Date();
	url_model.update({'url': data.url}, data, {upsert: true}, function(err,affected,raw) {
		if(err)
			console.log(err);
	});
}

exports.crawlAll = function(callback) {
  crawlPage(0, [baseUrl], callback);
};

exports.crawlOne = function(uri, callback) {
	uri = url.resolve(baseUrl, uri);
	var browser = new Browser(browserOpts);
  var promise = browser.visit(uri).
		then(function() {
			saveSnapshot(uri, browser.html());
			callback();
		}).
		fail(callback);
};
