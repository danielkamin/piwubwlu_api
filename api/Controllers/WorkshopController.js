const {roles} = require('../Utils/constants')
const supervisorCheck = require('../Utils/supervisorCheck')
const db = require("../../database/models")
const {  WorkshopValidation } = require('../Validation/resource')
const Op = db.Sequelize.Op;
Array.prototype.move = function (from,to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}

exports.createWorkshop = async (req, res) => {
  const { error } = WorkshopValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    room_number: req.body.room_number,
    labId: req.body.labId,
    additionalInfo:req.body.additionalInfo,
    typeId: req.body.typeId,
    employees: req.body.employees
  });
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const workshop = await db.Workshop.create(req.body);
    let supervisorEmployees = req.body.employees;
    res.on('finish',function () {
      supervisorEmployees.forEach(async (emp)=>{
        await db.WorkshopSupervisor.create({
          EmployeeId: emp.employeeId,
          WorkshopId: workshop.id
        });
        supervisorCheck(emp.employeeId,db,true)
      })
    })
    res.send({ id: workshop.id });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.removeWorkshop = async (req, res) => {
  const id = req.params.id;
  const workshop = await db.Workshop.findByPk(req.params.id,{
    include:db.Employee
  });
  if (!workshop) return res.status(400).send('Problem occurred with finding that type of workshop');
  try {
    let workshopSupervisors = workshop.Employees.length > 0 ? workshop.Employees : null;
    await db.Workshop.destroy({where:{
      id:id
    }});
    if(workshopSupervisors)
      res.on('finish',function () {
        workshopSupervisors.forEach(async (emp)=>{
          supervisorCheck(emp.id,db,false)
        })
      })
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
  if (!workshop) return res.status(400).send('Problem occurred with finding that type of workshop');
  const values = {
    name: req.body.name,
    english_name: req.body.english_name,
    labId: req.body.labId!==0?req.body.labId:null,
    typeId: req.body.typeId!==0?req.body.typeId:null,
    room_number: req.body.room_number,
    additionalInfo:req.body.additionalInfo,
  }
  const { error } = WorkshopValidation(values);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    await db.Workshop.update(values,{where:{id:id}});
    const oldWorkshopSupervisors = await db.WorkshopSupervisor.findAll({where:{WorkshopId:id}});

    await db.WorkshopSupervisor.destroy({where:{WorkshopId:id}})  
    oldWorkshopSupervisors.forEach(oldWorkshopSupervisor=>{
      supervisorCheck(oldWorkshopSupervisor.EmployeeId,db,false)
    })

    let supervisorEmployees = req.body.employees;
    res.on('finish',function () {
      supervisorEmployees.forEach(async (emp)=>{
        await db.WorkshopSupervisor.create({
          EmployeeId: emp.employeeId,
          WorkshopId: id
        });
        await supervisorCheck(emp.employeeId,db,true)
      })
    })
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
  res.send(res.filteredResults);
};
exports.getHelperNamesWorkshops = async(req,res)=>{
  try {
    const workshops = await db.Workshop.findAll({attributes:['name','id']});
    res.send(workshops);
  } catch (err) {
    res.send(err);
  }
}
exports.getWorkshopReservations = async (req,res)=>{
  const id = req.params.id;
  try{
    const resourcesWithEvents = await db.Machine.findAll({where:{workshopId:id},include:{model:db.Reservation,include:{model:db.Employee,include:db.User}}})
    res.send(resourcesWithEvents)
  }catch(err){
    res.send(err)
  }
}