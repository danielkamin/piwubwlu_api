const db = require('../../database/models')
const fs = require('fs')
const {promisify} = require('util')
const bcrypt = require('bcrypt')
const { newPasswordValidation } = require('../Validation/auth')
const unlinkAsync = promisify(fs.unlink) // unlink when deleting image
exports.deleteUser = async (req, res) => {
  console.log(req.params.id)
  const user = await db.User.findByPk(req.params.id);
  if (!user) return res.send('User not found');
  if(user.picturePath !== null){
    await unlinkAsync(user.picturePath)
  }
  try {
    await db.User.destroy({ where: { id: user.id } });
    res.status(200).send('User deleted successfully');
  } catch (err) {
    res.send(err.detail);
  }
}

//niepotrzebne?
exports.changePassword = async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.send('User not found');
  const { error } = newPasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    await db.User.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );
    res.send({ok:true});
  } catch (err) {
    return res.send(err);
  }
}

//niepotrzebne?
exports.getProfileInfo =async(req,res)=>{
  try{
    console.log(req.user)
    const user = await db.User.findOne({where:{id:req.user.id},include:{model:db.Employee,include:db.Degree}})
    return res.send(user)
  }catch(err)
  {
    return res.send(err.sql);
  }
}
exports.uploadProfilePicture = async (req,res)=>{
  const user = await db.User.findByPk(req.user.id);
  
    if(user.picturePath !== null){
      await unlinkAsync(user.picturePath)
    }
    await db.User.update({picturePath:req.file.path},{where:{id:user.id}})
    const temp = await db.User.findByPk(user.id)
    res.send({ok:true})
 
}
exports.updateProfileInfo = async(req,res)=>{
  try{
    await db.User.update({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,},
      {where:{id:req.user.id}})
    if(req.body.employee){ 
      await db.Employee.update({
        information:req.body.information,
        telephone:req.body.telephone,
        room:req.body.room,
      degreeId:req.body.degreeId},
        {where:{userId:req.user.id}})
      }
      res.send({ok:true})
  }catch(err){
    res.send(err)
  }
}
