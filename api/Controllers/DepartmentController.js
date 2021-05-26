const db = require('../../database/models')
const {DepartmentValidation} = require('../Validation/resource')
const logger = require('../Config/loggerConfig')


exports.createDepartment = async (req,res)=>{
    const { error } = DepartmentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const empId = req.body.employeeId!==''?req.body.employeeId:null
    try{
        await db.Department.create({
            name:req.body.name,
            english_name:req.body.english_name,
            employeeId:empId,
        });
        res.send({ ok: true });
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'createDepartment'})
    }
}
exports.updateDepartment = async (req,res)=>{
    const { error } = DepartmentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const empId = req.body.employeeId!==''?req.body.employeeId:null
    try{
        await db.Department.update(
            {
                name:req.body.name,
                english_name:req.body.english_name,
                employeeId:empId,
            },
            { where: { id: req.params.id } }
          );
          res.send({ ok: true });
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'updateDepartment'})
    }
}
exports.removeDepartment = async (req,res)=>{
    try{    
        await db.Department.destroy({ where: { id: req.params.id } });
        res.send({ok:true});
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'removeDepartment'})
    }
}
exports.getALLDepartment = async (req,res)=>{
    try{
        const departments = await db.Department.findAll();
        res.send(departments)
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'getALLDepartment'})
    }
}
exports.getDepartmentById = async (req,res)=>{
    try{
        const department = await db.Department.findOne({include:db.Employee},{where:{id:req.params.id}});
        res.send(department)
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'getDepartmentById'})
    }
}
exports.getDepartmentList = async (req,res)=>{
    try{
        const departments = await db.Department.findAll({attributes:['id','name']});
        res.send(departments)
    }catch(err)
    {
        res.send(err);
        logger.error({message: err, method: 'getDepartmentList'})
    }
}

