const db = require('../../database/models')
const {DepartmentValidation} = require('../Validation/resource')
const logger = require('../Config/loggerConfig')


exports.createDepartment = async (req,res)=>{
    const { error } = DepartmentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try{
        const department = await db.Department.create({
            name:req.body.name,
            english_name:req.body.english_name,
        });
        if(req.body.employeeId!==-1){
            const depHead = await db.DepartmentHead.findOne({where:{
                employeeId:+req.body.employeeId
            }})
            if(depHead===null){
                await db.DepartmentHead.create({
                    employeeId:+req.body.employeeId,
                    departmentId:department.id
                })
            }
            else{
                return res.status(400).send({message:'Pracownik jest już przypisany do innej katedry!'})
            }
        }
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
    const department = await db.Department.findByPk(req.params.id,{include:db.DepartmentHead})
    try{
        await department.update(
            {
                name:req.body.name,
                english_name:req.body.english_name,
            });
        let otherEmployeeDepartments
        const empId = +req.body.employeeId
        otherEmployeeDepartments = await db.DepartmentHead.findOne({where:{
            employeeId:empId
        }})
        if(empId !==-1){
            //create or update
            if(department.DepartmentHead!==null){
                if(department.DepartmentHead.employeeId!==empId){                    
                    if(otherEmployeeDepartments!==null){
                        return res.status(400).send({message:'Pracownik jest już przypisany do innej katedry!'})
                    }else{
                        await db.DepartmentHead.update({
                            employeeId:empId,
                        },{where:{
                            id:department.DepartmentHead.id
                        }})
                    }  
                }
            }else{
                if(otherEmployeeDepartments!==null){
                    return res.status(400).send({message:'Pracownik jest już przypisany do innej katedry!'})
                }else{
                    await db.DepartmentHead.create({
                        employeeId:empId,
                        departmentId:department.id
                    })
                }
            }
        }else{
            //delete
            if(department.DepartmentHead!==null){
                await db.DepartmentHead.destroy({where:{
                    departmentId:req.params.id
                }})
            }
        }
        res.send({ ok: true });
    }catch(err)
    {
        res.status(400).send(err);
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
        const department = await db.Department.findByPk(req.params.id,
            {include:{model:db.DepartmentHead,include:db.Employee}});
            console.log()
        res.send({
            id:department.id,
            name:department.name,
            english_name:department.english_name,
            employeeId:department.DepartmentHead!==null? department.DepartmentHead.Employee.id : -1
        })
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

