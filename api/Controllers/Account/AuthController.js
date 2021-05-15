const bcrypt = require('bcrypt');
const db = require('../../../database/models')
const {roles,guestTypes,WEB_URL} = require('../../Utils/constants')
const { sendRefreshToken } = require('../../Utils/sendRefreshToken')
const { createRefreshToken, createAccessToken } = require('../../Utils/tokenCreate')
const { registerValidation, loginValidation, adminLoginValidation } = require('../../Validation/auth')
const {sendMessage} = require('../../EmailService/config')

const validatePassAndResult = async (req,res,user,isAdmin)=>{
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).send('Nazwa użytkownika lub hasło są nieprawidłowe');
    const guest = await db.Guest.findOne({where:{userId:user.id}})
    if(guest&&guest.isVerified==false ) return res.status(403).send('Twoje konto czeka na weryfikację')
    const userRoles = await db.UserRole.findAll({
      attributes:['userId','roleId'],
      where: {
        userId: user.id,
      }
    });
    const rolesDb = await db.Role.findAll(  {attributes:['role_name','id']});
    let temp_roles_id = userRoles.map((role) => role.roleId);
    let user_roles = rolesDb.map((role) => {
      if (temp_roles_id.includes(role.id)) return role.role_name;
    });
    let userName =user.firstName + ' ' + user.lastName;
    sendRefreshToken(res, createRefreshToken(user, user_roles,userName),isAdmin);
    res.send({ accessToken: createAccessToken(user.dataValues, user_roles,userName) });
  }
exports.register = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const emailExist = await db.User.findOne({ where: { email: req.body.email } });
    if (emailExist)
      return res
        .status(409)
        .send('Użytkownik z podanym adresem e-mail już istnieje');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try {  
      const user = await db.User.create({
        email: req.body.email,
        password: hashedPassword,     
        userType:guestTypes.guest,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        picturePath:null
      });
      await db.Guest.create({isVerified:false,userId:user.id})
      const role = await db.Role.findOne({where:{role_name:roles[3]}})
      await db.UserRole.create({
        userId: user.id,
        roleId: role.id,
      });
      await sendMessage(user.email,
        'PIWUB - nowe konto',
        'Pomyślnie zarejestrowałeś się w naszym serwisie. Proszę czekać na wiadomość z informacją o akceptacji rejestracji przez administratora')
      res.send({ok:true});
    } catch (err) {
      res.status(400).send(err);
    }
  };
exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await db.User.findOne({ where: { email: req.body.email, } });
  if (!user) return res.status(400).send('E-mail lub hasło są nieprawidłowe');
  validatePassAndResult(req,res,user,false);
};
  exports.adminLogin = async (req,res)=>{
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await db.User.findOne({ where: { email: req.body.email,userType:"ADMIN" } });
    if (!user) return res.status(400).send('Nazwa użytkownika lub hasło są nieprawidłowe');
    validatePassAndResult(req,res,user,false)
  }
  exports.logout = async (req, res) => {
    res.clearCookie('token').send('Logged out');
    
  };
  exports.adminLogout = async (req, res) => {
    res.clearCookie('adminToken').send('Logged out');
    
  };