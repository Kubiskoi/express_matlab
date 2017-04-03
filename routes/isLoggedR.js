//overi clientovi ci je prihlasny, vrati 200 ak je prihlaseny, vrati false ak nie je prihlaseny
module.exports = function (req,res) {
	//tu overujem ci moj randomny vygenerovany session string je rovnaky u klienta v cookies ako aj na serveri
	//a ci vobec exsituje takyto string, lebo aj dva krat undefined sa rovna ale vtedy nie je nikto prihlaseny
	if(req.session.lu == req.cookies.lu && req.session.lu && req.cookies.lu){
		res.sendStatus(200);
	}else{
		res.sendStatus(401);
	}
};