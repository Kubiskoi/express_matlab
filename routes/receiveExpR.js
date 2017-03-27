//http://stackoverflow.com/questions/23691194/node-express-file-upload

var fs = require('fs-extra');
var unzip = require('unzip');

module.exports = function (req,res) {
	var fstream;
	var unzip_fstream;
	     req.pipe(req.busboy);
	     req.busboy.on('file', function (fieldname, file, filename) {
	         // console.log("Uploading: " + filename);

	         //Path where image will be uploaded
	         fstream = fs.createWriteStream(__dirname + '/../simulacie/' + filename);
	         file.pipe(fstream);
	         fstream.on('close', function () {    
	             // console.log("Upload Finished of " + filename);

	             //https://www.npmjs.com/package/unzip
	             //unzipni uploadnuty folder a vymaz zip zo serveru
	            unzip_fstream = fs.createReadStream(__dirname + '/../simulacie/' + filename).pipe(unzip.Extract({ path: __dirname + '/../simulacie' }));
	            //unzpip ked skonci emitne event close
	            unzip_fstream.on('close', function () {
	            	fs.remove(__dirname + '/../simulacie/' + filename,function(err){
	            		//if err nieco je zle inak
	            		res.sendStatus(200);

	            	})
	            });           
	         });
	     });
};