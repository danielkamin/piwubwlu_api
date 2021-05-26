const express =require('express')
const CASRouter = express.Router();
const {CASLogin,protected,userInfo} = require('../Controllers/Account/CASController')
const CAS = require('../Config/CAS')

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
CASRouter.get('/cas_login',CAS.bounce,CASLogin)

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
CASRouter.get('/cas_block', CAS.block,protected)

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
CASRouter.get('/cas_block/user', CAS.block,userInfo)

// Unauthenticated clients will be redirected to the CAS login and then to the
  // provided "redirectTo" query parameter once authenticated.
  CASRouter.get('/cas_authenticate', CAS.bounce_redirect)

// This route will de-authenticate the client with the Express server and then
  // redirect the client to the CAS logout page.
  CASRouter.get('/cas_logout', CAS.logout );
module.exports = CASRouter;