const db = require('../../database/models')
const fetch = require('node-fetch')
const {WEB_URL_NOPORT,WEB_URL} = require('../Utils/constants')
exports.getImagesPath = async (req,res)=>{
    res.send({logoPath:WEB_URL_NOPORT+':5000/uploads/LogoPB.png',bgPath:WEB_URL_NOPORT+':5000/uploads/background.jpg'})
}
exports.verifyCaptcha = async(req,res)=>{
    const user = await db.User.findByPk(req.body.userId,{attributes:['email']})
    if (!req.body.captcha)
      return res.send({ ok: false, msg: 'Please select captcha' });
  
    const secret = process.env.CAPTCHA_SECRET;
    try{
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`
      const body = await fetch(verifyUrl).then(res => res.json());
      if (body.success !== undefined && !body.success)
        return res.send({ ok: false, msg: 'Failed captcha verification' });
    
      return res.send({ ok: true, msg: 'Captcha passed',email:user.email });
    }catch(err){
      res.send(err)
    }
  }