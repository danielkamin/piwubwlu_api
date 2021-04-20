const express =require('express')
const CASRouter = express.Router();
const {CASLogin,protected} = require('../Controllers/Account/CASController')
const CASAuthentication = require('cas-authentication');
const cas = new CASAuthentication({
  cas_url         : 'https://casserver.herokuapp.com/cas',
  service_url     : 'http://77.46.45.243:3000'
});

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
CASRouter.get('/login',cas.bounce,CASLogin)

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
CASRouter.get('/api', cas.block,protected)

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
CASRouter.get('/api/user', cas.block,CASLogin)

// Unauthenticated clients will be redirected to the CAS login and then to the
  // provided "redirectTo" query parameter once authenticated.
  CASRouter.get('/authenticate', cas.bounce_redirect)

// This route will de-authenticate the client with the Express server and then
  // redirect the client to the CAS logout page.
  CASRouter.get('/logout', cas.logout );
module.exports = CASRouter;