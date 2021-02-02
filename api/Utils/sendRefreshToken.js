/**
 * If admin == true, cookie will be set to admin
 * @param {Object} res 
 * @param {JWT} token 
 * @param {Boolean} isAdmin 
 * @return Appends Http-only cookie to Result Object
 */
exports.sendRefreshToken = (res, token,isAdmin) => {
    if(isAdmin)res.cookie('adminToken', token, { httpOnly: true, Path: '/' });
    else {
      res.cookie('token', token, { httpOnly: true, Path: '/' });
    }
    
  };
  
  