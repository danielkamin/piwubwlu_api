const {WEB_URL} = require('../../Utils/constants')
const CAS = require('../../Config/CAS')
exports.CASLogin = ( req, res )=> {
    //casuser
    //Mellon
    res.redirect('http://77.46.45.243:3000')
};
  
exports.protected=( req, res )=> {
    console.log(res)
    res.json( { success: true } );
};
  
  
exports.userInfo =( req, res )=> {
    res.json( { cas_user: req.session[ CAS.session_name ] } );
};
