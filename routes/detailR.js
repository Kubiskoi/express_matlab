var klaw = require('klaw');
var path = require('path');


//https://github.com/jprichardson/node-klaw
module.exports = function (req,res) {

	var filterFunc = function(item){
	  var basename = path.basename(item)
	  return basename === '.' || basename[0] !== '.'
	}

	var items = [] // files, directories, symlinks, etc
	klaw(__dirname+'/../simulacie/'+req.params.exp_name,{ filter : filterFunc  })
	  .on('data', function (item) {
	  	items.push(item.path);
	  })
	  .on('end', function () {
		res.send(items);
	  }).on('error', function (err, item) {
    	console.log(err.message)
    	console.log(item.path) // the file the error occurred on
  	  })

  


};