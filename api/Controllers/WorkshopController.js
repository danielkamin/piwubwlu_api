const {roles} = require('../Utils/constants')
const supervisorCheck = require('../Utils/supervisorCheck')
const db = require("../../database/models")
const {  WorkshopValidation } = require('../Validation/resource')
const Op = db.Sequelize.Op;
Array.prototype.move = function (from,to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}

exports.createWorkshop = async (req, res) => {
  console.log(req.body.employees)
  const { error } = WorkshopValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    room_number: req.body.room_number,
    labId: req.body.labId,
    typeId: req.body.typeId,
    employees: req.body.employees
  });
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const workshop = await db.Workshop.create(req.body);
    req.body.employees.forEach(async (emp)=>{
      console.log(emp)
      await db.WorkshopSupervisor.create({
        EmployeeId: emp.employeeId,
        WorkshopId: workshop.id
      });
      supervisorCheck(emp.employeeId,db,true)
    })
    // sprawdzanie roli supervisora z możliwością na res.on('finish',()=>{})
    res.send({ id: workshop.id });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.removeWorkshop = async (req, res) => {
  const workshop = await db.Workshop.findByPk(req.params.id,{include:db.Employee});
  console.log(workshop)
  if (!workshop) return res.status(400).send('Problem occurred with finding that type of workshop');
  try {
    await db.Workshop.destroy({
      where: { id: req.params.id }
    });
    if(workshop.Employees[0].id!==undefined)
      res.on('finish',function(){supervisorCheck(workshop.Employees[0].id,db,false)})
    res.send({ok:true});
  } catch (err) {
    res.send(err);
  }
};
exports.getAllWorkshop = async (req, res) => {
  try {
    const workshops = await db.Workshop.findAll({include:[{model:db.Lab},{model:db.WorkshopType},{model:db.Employee}]});
    res.send(workshops);
  } catch (err) {
    res.send(err);
  }
};
exports.updateWorkshop = async (req, res) => {
  const id = req.params.id;
  const workshop = await db.Workshop.findByPk(id);
  console.log(req.body)
  if (!workshop) return res.status(400).send('Problem occurred with finding that type of workshop');
  const { error } = WorkshopValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    await db.Workshop.update({
      name: req.body.name,
      english_name: req.body.english_name,
      labId: req.body.labId,
      typeId: req.body.typeId,
      room_number: req.body.room_number,
    },{where:{id:id}});
    // const WS = await db.WorkshopSupervisor.findAll({where:{WorkshopId:id}})
    // WS.forEach(async (ws)=>{
    //   await supervisorCheck(ws.EmployeeId,db,false)
    // })
    await db.WorkshopSupervisor.destroy({where:{WorkshopId:id}})  
    req.body.employees.forEach(async (item)=>{
      await db.WorkshopSupervisor.create({WorkshopId:id,EmployeeId:item.employeeId})
      supervisorCheck(item.employeeId,db,true)
    })
    // sprawdzanie roli supervisora z możliwością na res.on('finish',()=>{})
    res.send({ id: id });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.getWorkshopById = async (req, res) => {
  try {
    let workshopQuery = await db.Workshop.findByPk(req.params.id,{include:[{model:db.Machine},{model:db.Employee,include:db.User},{model:db.WorkshopType}]})
    const workshopSupervisorsOrder = await db.WorkshopSupervisor.findAll({where:{WorkshopId:req.params.id}})
    if(workshopQuery.Employees.length>1){
      let firstSupervisorIndex = workshopQuery.Employees.map((item)=>{
        return item.id
      }).indexOf(workshopSupervisorsOrder[0].EmployeeId)
      workshopQuery.Employees.move(firstSupervisorIndex,0)
    }
    
    res.send(workshopQuery);
  } catch (err) {
    res.send(err.sql);
  }
};
exports.getWorkshopsList = async (req, res) => {
  const name = (req.query.q===undefined)?'':(req.query.q)
  try {
    let workshopList=[]
    switch(req.query.sort){
      case 'asc':
        workshopList= await db.Workshop.findAll({
          attributes: ['id', 'name','english_name','imagePath'],order:[['name','ASC']],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
      case 'desc':
        workshopList= await db.Workshop.findAll({
          attributes: ['id', 'name','english_name','imagePath'],order:[['name','DESC']],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
      default:
        workshopList= await db.Workshop.findAll({
          attributes: ['id', 'name','english_name','imagePath'],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
    }
    res.send(workshopList);
  } catch (err) {
    res.send(err.sql);
  }
};

exports.filteredResults = async(req,res)=>{
  if(req.query.workshop!==''){

  }else{
    
  }
}
