const db = require( '../../database/models')
const {roles} = require( '../Utils/constants')
const { validatePassword } = require( '../Utils/helpers')
const { EmployeeProfileValidation,guestProfileValidation} = require( '../Validation/auth')
/* GET - User model fetch with Employee model left join */
exports.updateEmployee= async (req,res)=>{
   let userBody = {firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email}
   const {id} = req.params;
   const {error} = guestProfileValidation(userBody)
   if(error) return res.status(400).send(error.details[0].message)
   const user = await db.User.findOne({where:{email:req.body.email}})
   if(user!==null && user.id!=req.params.id) return res.status(400).send('Podany e-mail już istnieje')

   try{
      if(req.body.password!='')
      {
         userBody.password= await validatePassword(req,res);
         await db.User.update(userBody,{where:{id:id}})
      }
      else{
         await db.User.update(userBody,{where:{id:id}})
      } 
      if(req.body.setEmployee===false){
         const guest = await db.Guest.create({userId:id,isVerified:true})
         const role = await db.Role.findOne({where:{role_name:roles[2]}})
         await db.UserRole.destroy({where:{
           userId: guest.userId,
           roleId: role.id,
         }});
         await db.Employee.destroy({where:{userId:id}});
      }
      else {
         await db.Employee.update({
            departmentId:req.body.departmentId===0?null:req.body.departmentId,
            degreeId:req.body.degreeId===0?null:req.body.degreeId,
            telephone:req.body.telephone,
            room:req.body.room},
         {where:{userId:id}})
      }
      res.send({ok:true})
   }catch(err)
   {
      res.send(err)
   }
}
exports.getEmployeeList = async(req,res)=>{
   try{
      const empList = await db.User.findAll({ attributes: ['id', 'firstName','lastName'],
      include:{model:db.Employee,attributes:['id','departmentId'],required:true} });
    res.send(empList);
   }catch(err)
   {
      res.send(err)
   }
}
exports.getEmployeeById = async (req,res)=>{
 try{
   // const employee = await db.Employee.findOne({where:{userId:req.params.id},
   //    include:[{model:db.User,required:true,attributes:['firstName','lastName','email']},{model:db.Department}]});
   const employee = await db.User.findByPk(req.params.id,{attributes:['firstName','lastName','id','picturePath',],
   include:[{model:db.Employee,required:true,
      include:[{model:db.Department},{model:db.Degree}]}]})
   res.send(employee)
 }catch(err){
    res.send(err.sql);
 }
}
exports.updateEmployeeProfile = async (req,res)=>{
   const {error}=EmployeeProfileValidation(req.body.information)
   if(error) return res.status(400).send(error.details[0].message);
   try{
     await db.Employee.update({
      information:req.body.information,
      departmentId:req.body.departmentId,
      degreeId:req.body.degreeId,
     },{where:{id:req.body.id}})
     res.send({ok:true})
   }catch(err){
     return res.send(err);
   }
}
exports.displayEmployees = async (req,res)=>{
   try{
   //    const employees = await db.Employee.findAll({ attributes:['departmentId','id','userId'],
   //    include:[
   //    {model:db.User,required:true,attributes:['id','firstName','lastName','email','picturePath']},
   //    {model:db.Department,attributes:['id','name']}
   // ]}) 
      const employees = await db.User.findAll({where:{userType:'GUEST'},attributes:['id','firstName','lastName','picturePath','userType'],include:[{model:db.Employee,required:true,include:[{model:db.Department},{model:db.Degree}]}]},)
   res.send(employees)
   }catch(err)
   {
      res.send(err.sql)
   }
}
exports.getAllEmployee = async (req,res)=>{
   try{
      const empList = await db.User.findAll
      ({ attributes: ['id', 'firstName','lastName','userType','email'],
      include:{model:db.Employee,required:true,attributes:['id','departmentId','degreeId']} });
      res.send(empList)
   }catch(err)
   {
      res.send(err.sql)
   }
}