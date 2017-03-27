var fs = require('fs-extra');

module.exports = function (req,res) {
	fs.remove(__dirname+'/../simulacie/'+req.params.del_exp_name,function(err){
		if(err)res.sendStatus(500);
		res.sendStatus(200);
	})
};