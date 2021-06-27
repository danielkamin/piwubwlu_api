const db = require( '../../database/models')
const {UserRoles} = require( '../Utils/constants')
const { validatePassword } = require( '../Utils/helpers')
const { guestProfileValidation} = require( '../Validation/auth')
const { EmployeeProfileValidation} = require( '../Validation/resource')
const logger = require('../Config/loggerConfig')

exports.updateEmployee= async (req,res)=>{
   let userBody = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email
   }
   const {id} = req.params;
   const {error} = guestProfileValidation(userBody)
   if(error) return res.status(400).send(error.details[0].message)
   const user = await db.User.findOne({where:{email:req.body.email}})
   if(user!==null && user.id!=req.params.id) return res.status(400).send('Podany e-mail już istnieje')

   try{
      if(req.body.password!=='')
      {
         userBody.password= await validatePassword(req,res);
         await db.User.update(userBody,{where:{id:id}})
      }
      else{
         await db.User.update(userBody,{where:{id:id}})
      } 

      if(req.body.setEmployee===false){
         const guest = await db.Guest.create({userId:id,isVerified:true})
         const role = await db.Role.findOne({where:{role_name:UserRoles.EMPLOYEE}})
         await db.UserRole.destroy({where:{
           userId: guest.userId,
           roleId: role.id,
         }});
         await db.Employee.destroy({where:{userId:id}});
      }
      else {
         console.log(req.body)
         await db.Employee.update({
            departmentId:req.body.departmentId===0?null:+(req.body.departmentId),
            degreeId:req.body.degreeId===0?null:req.body.degreeId,
            telephone:req.body.telephone,
            room:req.body.room},
         {where:{userId:id}})
      }
      
      res.send({ok:true})
   }catch(err)
   {
      res.send(err)
      logger.error({message: err, method: 'updateEmployee'})
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
      logger.error({message: err, method: 'getEmployeeList'})
   }
}
exports.getEmployeeById = async (req,res)=>{
 try{
   // const employee = await db.Employee.findOne({where:{userId:req.params.id},
   //    include:[{model:db.User,required:true,attributes:['firstName','lastName','email']},{model:db.Department}]});
   const employee = await db.User.findByPk(req.params.id,{attributes:['firstName','lastName','id','imagePath','email'],
   include:[{model:db.Employee,required:true,
      include:[{model:db.Department},{model:db.Degree}]}]})
   res.send(employee)
 }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getEmployeeById'})
 }
}
exports.updateEmployeeProfile = async (req,res)=>{
   const {error}=EmployeeProfileValidation(req.body.information)
   if(error) return res.status(400).send(error.details[0].message);
   try{
     await db.Employee.update({
      knowledgeBaseUrl:req.body.knowledgeBaseUrl,
      departmentId:req.body.departmentId,
      degreeId:req.body.degreeId,
     },{where:{id:req.body.id}})
     res.send({ok:true})
   }catch(err){
     res.send(err);
     logger.error({message: err, method: 'updateEmployeeProfile'})
   }
}
exports.displayEmployees = async (req,res)=>{
   try{
   //    const employees = await db.Employee.findAll({ attributes:['departmentId','id','userId'],
   //    include:[
   //    {model:db.User,required:true,attributes:['id','firstName','lastName','email','picturePath']},
   //    {model:db.Department,attributes:['id','name']}
   // ]}) 
      const employees = await db.User.findAll({where:{userType:'GUEST'},attributes:['id','firstName','lastName','imagePath','userType'],include:[{model:db.Employee,required:true,include:[{model:db.Department},{model:db.Degree}]}]},)
   res.send(employees)
   }catch(err)
   {
      res.send(err)
      logger.error({message: err, method: 'displayEmployees'})
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
      res.send(err)
      logger.error({message: err, method: 'getAllEmployee'})
   }
}

exports.getAllSupervisedResources = async (req,res)=>{
   try{
      let combinedResources = []
      if(req.user.role.indexOf(UserRoles.DEPARTMENTHEAD)!==-1){
         const employeeWithResources = await db.Employee.findOne({where:{userId:req.user.id},
            include:{model:db.DepartmentHead,include:{model:db.Department,
            include:{model:db.Lab,
               include:{model:db.Workshop,include:db.Machine}}}}})  

         employeeWithResources.DepartmentHead.Department.Labs.forEach(labs=>{
         
            combinedResources.push({
               id:'LAB'+labs.id,
               name:labs.name,
               english_name:labs.english_name,
               description:'Laboratorium',
               type:'LAB',
               dbIndex:labs.id
            })
            labs.Workshops.forEach(workshops=>{
               combinedResources.push({
                  id:'WORKSHOP'+workshops.id,
                  name:workshops.name,
                  english_name:workshops.english_name,
                  description:'Pracownia',
                  type:'WORKSHOP',
                  dbIndex:workshops.id
               })

               workshops.Machines.forEach(machine=>{
                  combinedResources.push({
                     id:'MACHINE'+machine.id,
                     name:machine.name,
                     english_name:machine.english_name,
                     type:machine.resourceType,
                     description:'Aparatura/Oprogramowanie',
                     dbIndex:machine.id
                  })
               })
            })
         })
         res.send(combinedResources)
      }else if(req.user.role.indexOf(UserRoles.SUPERVISOR)!==-1){
         const workshops = await db.Workshop.findAll({include:{model:db.Employee,where:{userId:req.user.id}}})
         workshops.forEach(workshop=>{
            combinedResources.push({
               id:'WORKSHOP'+workshop.id,
               name:workshop.name,
               english_name:workshop.english_name,
               description:'Pracownia',
               type:'WORKSHOP',
               dbIndex:workshop.id
            })
         })
         return res.send(combinedResources)
      }
      else {
         res.send([])
      }
   
   }catch(err)
   {
      res.send(err)
      logger.error({message: err, method: 'getAllSupervisedResources'})
   }
}

exports.getUsersByType = async (req,res)=>{
   try{
      const users = await db.User.findAll
      ({ attributes: ['id', 'firstName','lastName','userType','email'],where:{userType:req.params.type.toUpperCase()}});
      res.send(users)
   }catch(err)
   {
      res.send(err)
      logger.error({message: err, method: 'getUsersByType'})
   }
}