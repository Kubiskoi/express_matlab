module.exports = function (req,res) {
		if(req.session.lu == req.cookies.lu && req.session.lu && req.cookies.lu){
			      req.session.destroy(function () {
			          res.clearCookie('lu');
			          res.clearCookie('userID');
			          res.clearCookie('logged_user_name');

			          res.sendStatus(200);
			      });


		}else{
			res.sendStatus(500);
		}
};