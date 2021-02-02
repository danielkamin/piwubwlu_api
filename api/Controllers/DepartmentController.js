const db = require('../../database/models')
const {DepartmentValidation} = require('../Validation/resource')
exports.createDepartment = async (req,res)=>{
    const { error } = DepartmentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
    try{
        await db.Department.create({
            name:req.body.name,
            english_name:req.body.english_name
        });
        res.send({ ok: true });
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.updateDepartment = async (req,res)=>{
    const { error } = DepartmentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
    try{
        await db.Department.update(
            {
              name: req.body.name,
              english_name: req.body.english_name
            },
            { where: { id: req.params.id } }
          );
          res.send({ ok: true });
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.removeDepartment = async (req,res)=>{
    try{    
        await db.Department.destroy({ where: { id: req.params.id } });
        res.send({ok:true});
    }catch(err)
    {
        res.send(err.original.detail);
    }
}
exports.getALLDepartment = async (req,res)=>{
    try{
        const departments = await db.Department.findAll();
        res.send(departments)
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.getDepartmentById = async (req,res)=>{
    try{
        const department = await db.Department.findOne({include:db.Employee},{where:{id:req.params.id}});
        res.send(department)
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.getDepartmentList = async (req,res)=>{
    try{
        const departments = await db.Department.findAll({attributes:['id','name']});
        res.send(departments)
    }catch(err)
    {
        res.send(err.sql);
    }
}