const db = require('../../database/models')
const { validatePassword} = require('../Utils/helpers')
const { sendMessage } = require('../EmailService/config')
const {roles} = require('../Utils/constants')
const { guestProfileValidation} = require('../Validation/auth')
//GET methods - fetch user model with guest join
exports.getGuestList = async(req,res)=>{
    try{
      const guests = await db.User.findAll({include:{model:db.Guest,required:true}})
      res.send(guests)
    }catch(err){
      console.log(err)
    }
  }
exports.getGuestById = async(req,res)=>{
    try{
      const guest = await db.User.findOne({include:db.Guest,where:{id:req.params.id}})
      res.send(guest)
    }catch(err)
    {
      res.send(err.sql)
    }
  }
exports.updateGuest = async (req,res) => {
    //zmiana weryfikacji 
    const guest = await db.Guest.findOne({where:{userId:req.params.id},include:db.User});
    if (!guest) return res.status(400).send('No guest was found');
    let messageBody = {firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email}
    console.log(req.body)
    const { error } = guestProfileValidation(messageBody);
    if (error) return res.status(400).send(error.details[0].message);
    if(req.body.setEmployee == true) {
      const emp = await db.Employee.create({userId:guest.userId,information:'',telephone:'',room:''})
      await guest.destroy();
      const role = await db.Role.findOne({where:{role_name:roles[2]}})
      await db.UserRole.create({
        userId: emp.userId,
        roleId: role.id,
      });
      sendMessage(guest.User.email,'PIWUB - status konta','Twoje konto uzyskało daną rolę: PRACOWNIK')   
    }else {
      await db.Guest.update(
        { isVerified: req.body.isVerified },
        { where: { id: guest.id} }
      ); 
      if(req.body.isVerified===true) sendMessage(guest.User.email,'PIWUB - status konta','Status twojego konta zmienił się na: AKTYWNY')
      else sendMessage(guest.User.email,'PIWUB - status konta','Status twojego konta zmienił się na: NIEAKTYWNY')
    }
    if(req.body.password!=='') messageBody.password= await validatePassword(req,res);      
    try {    
      await db.User.update(messageBody,{where:{id:req.params.id}}) 
      res.send({ok:true})
    } catch (err) {
      res.send(err);
    }
  };
  