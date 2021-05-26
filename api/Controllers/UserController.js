const db = require('../../database/models')
const fs = require('fs')
const {promisify} = require('util')
const bcrypt = require('bcrypt')
const { newPasswordValidation } = require('../Validation/auth')
const unlinkAsync = promisify(fs.unlink) // unlink when deleting image
const logger = require('../Config/loggerConfig')

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
    logger.error({message: err, method: 'deleteUser'})
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
    res.send(err);
    logger.error({message: err, method: 'changePassword'})
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
    res.send(err.sql);
    logger.error({message: err, method: 'getProfileInfo'})
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
  const id = req.user.id;
  try{
    await db.User.update({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,},
      {where:{id:id}})

    if(req.body.employee===true){ 
      await db.Employee.update({
        information:req.body.information,
        telephone:req.body.telephone,
        room:req.body.room,
        degreeId:req.body.degreeId===0?null:req.body.degreeId,},
        {where:{userId:id}})
      }
      res.send({ok:true})
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'uploadProfilePicture'})
  }
}
