var ldap = require('ldapjs');
var randomstring = require("randomstring");

module.exports = function (req, res) {
    // console.log('login', req.body);

    //ak som prijal meno a heslo tak ...
    if (req.body.username && req.body.password) {
        //... vytvorim ldap clienta
        var client = ldap.createClient({
            url: 'ldap://ldap.stuba.sk'
        });

        var rdn = 'uid=' + req.body.username + ', ou=People, DC=stuba, DC=sk';
        var password = req.body.password;

        // TODO: dont delete code for production!!!!
        client.bind(rdn, password, function (err) {

            // If there is an error, tell the user about it. Normally we would
            // log the incident, but in this application the user is really an LDAP
            // administrator.
            if (err != null) {
                //console.log('Login problem', err);
                if (err.name === 'InvalidCredentialsError') {
                    console.log('Credential error');
                    //ak je nejaky problem vrat 401, to uz client rozpozna a zobrazi spravu
                    res.sendStatus(401);

                }
                else {
                    console.log('Unknown error: ' + JSON.stringify(err));
                    //ak je nejaky problem vrat 401, to uz client rozpozna a zobrazi spravu
                    res.sendStatus(401);
                    // res.redirect('/');
                    // problem with ldap, try later
                }
            }
            else{
                //vytvorim random string
                //ten priradim sesne na serveri
                //a nastavim ho aj ako cookies
                var lu_key = randomstring.generate();
                req.session.lu = lu_key;
                res.cookie('lu', lu_key);
                res.cookie('logged_user_name', req.body.username);
                res.sendStatus(200);

            }
        });

    } else {
        //nedostal som meno alebo heslo tak vratim chybu, client rozpozna  upozorni na zle vstupy
        res.sendStatus(401);
    }
};