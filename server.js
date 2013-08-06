var fs = require('fs');
var exec = require('child_process').exec;
var express = require('express');

// Load the photo lib
var photos = require('./photos/priv.json');

// Create the express server
var app = express()

// Logging & Compress
.use(express.logger({
	stream: fs.createWriteStream('./access.log', {flags: 'a'})
}))
.use(express.compress())

// Serve static files from ./static
.use(express.static(__dirname + '/static'))

// Serve photos
.get('/photos/:id/:type', function(req, res) {
	var id = req.params['id'];
	var type = req.params['type'];

	if(!(id in photos)) {
		res.redirect(301, '/');
		return;
	}
	
	var path;
	if(type == undefined || type == "thumb") {
		var photo = photos[id].split(".");
		path = './photos/'+photo[0]+'_thumb.JPG'
	}
	else if(type == "big") {
		path = './photos/'+photos[id];
	}
	else {
		res.redirect(301, '/');
		return;
	}

	fs.stat(path, function(err, stat) {	
		res.set('Content-Type', 'image/jpeg');
		res.set('Content-Length', stat.size);

		var stream = fs.createReadStream(path);
		stream.pipe(res);
	});
});

// Create the client and listen on port 6000
exec("browserify ./client.js -o ./static/bundle.js &&" +
	 "uglifyjs ./static/bundle.js -o ./static/bundle.min.js &&" +
	 "rm ./static/bundle.js", 
	function(error, stdout, stderr) {
		if(stderr != "") console.log(stderr);
		else {
			console.log("Listening on port 6000");
			app.listen(6000);
		}
	}
)
