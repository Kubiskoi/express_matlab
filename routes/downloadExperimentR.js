var fs = require('fs');
var archiver = require('archiver');

// http://stackoverflow.com/questions/15641243/need-to-zip-an-entire-directory-using-node-js
//https://www.npmjs.com/package/archiver
module.exports = function (req,res) {

	// output zachytava stream a uklada do suboru
	var output = fs.createWriteStream(req.params.exp_name+'.zip');
	var archive = archiver('zip');

	// ked sa skonci stream emitne sa close event a tu sa zachyti
	output.on('close', function () {

	    var options = {
	        root: __dirname+'/..',
	        dotfiles: 'deny',
	        headers: {
	            'x-timestamp': Date.now(),
	            'x-sent': true
	        }
	      };

	      var fileName = req.params.exp_name+'.zip';
	      //server vrati zipnuty subor
	      res.sendFile(fileName, options, function (err) {
	        if (err) {
	          console.log(err);
	          res.sendStatus(500);
	        } else {
	        	//ak sa subor spravne odoslal tak sa vymaze zo serveru
	          console.log('Sent:', fileName);
	          fs.unlink(__dirname+'/../'+req.params.exp_name+'.zip');
	        }
	      });
	});

	//ak nastane chyba pri vytvarani zipu
	archive.on('error', function(err){
		console.log(err);
	    res.sendStatus(500);
	});

	//presmerovanie do streamu
	archive.pipe(output);
	//ktory priecinok sa ma zazipovat
	archive.directory('simulacie/'+req.params.exp_name);

	archive.finalize();
};