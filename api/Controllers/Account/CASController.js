const {WEB_URL} = require('../../Utils/constants')

exports.SSOLogin =  (req,res)=>{
    res.redirect('https://casserver.herokuapp.com/cas/login')
}

exports.CASLogin = ( req, res )=> {
    res.send( '<html><body>Hello!</body></html>' );
};
  
exports.protected=( req, res )=> {
    res.json( { success: true } );
};
  
  
exports.userInfo =( req, res )=> {
    res.json( { cas_user: req.session[ cas.session_name ] } );
};