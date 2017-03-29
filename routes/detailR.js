var path = require('path');
var fs = require('fs');

// http://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js
module.exports = function (req,res) {

	var that = this;

	this.dirTree = function(filename) {
	    var stats = fs.lstatSync(filename),
	        info = {
	            path: filename,
	            name: path.basename(filename)
	        };

	    //na miesto .DS_store alebo .git vrati string hidden
	    if(info.name[0] === '.') return {name:"hidden",type:"hidden"};

	    if (stats.isDirectory()) {
	        info.type = "folder";
	        info.children = fs.readdirSync(filename).map(function(child) {
	            return that.dirTree(filename + '/' + child);
	        });
	    } else {
	        // Assuming it's a file. In real life it could be a symlink or
	        // something else!
	        info.type = "other";
	    }

	    return info;
	}

	var my_dir = this.dirTree(__dirname+'/../simulacie/'+req.params.exp_name);
	res.send(my_dir);
};