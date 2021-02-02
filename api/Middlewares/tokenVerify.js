const jwt = require('jsonwebtoken')
const { createAccessToken, createRefreshToken } = require('../Utils/tokenCreate')
const { sendRefreshToken } = require('../Utils/sendRefreshToken')
const verifyAccessToken = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(403).send('Access Denied');
  const token = req.headers.authorization.split(' ');
  if (token[0] !== 'Bearer') {
    return res.status(403).send('Access Denied');
  }
  if (!token[1]) {
    return res.status(403).send('Access Denied');
  }
  try {
    const verified = jwt.verify(token[1], process.env.ACCESS_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
};

const verifyRefreshToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).send({ ok: false, accessToken: '' });
  let verified = null;
  verify(verified,token,res,false);
};
const verifyAdminRefreshToken = async(req,res)=>{
  const token = req.cookies.adminToken;
  if (!token) return res.status(403).send({ ok: false, accessToken: '' });
  let verified = null;
  verify(verified,token,res,true);
}

const verify = async (verified,token,res,isAdmin)=>{
  try {
    verified = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (err) {
    console.log(err);
    return res.status(401).send({ ok: false, accessToken: '' });
  }
  sendRefreshToken(res, createRefreshToken(verified, verified.role),isAdmin);
  return res.send({
    ok: true,
    accessToken: createAccessToken(verified, verified.role),
  });
}
const verifyResetToken = async (req, res, next) => {
  const token = req.params.token;
  if (!token) return res.status(403).send({ ok: false});
  try {
    const verified = jwt.verify(token, process.env.RESET_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).send(err);
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken, verifyResetToken,verifyAdminRefreshToken };
