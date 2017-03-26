var fs = require('fs');
var junk = require('junk');

module.exports = function (req,res) {
	fs.readdir(__dirname+'/../simulacie',function(err,files){
		res.send({"experiments":files.filter(junk.not)});
	})
};