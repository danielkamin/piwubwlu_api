const db = require('../../database/models')
const _ = require("lodash");
const {sendMessage} = require('../EmailService/config')
const {sendMachineSuspendedEmails} = require('../EmailService/messages')
const { MachineValidation } = require('../Validation/resource')
const Op = db.Sequelize.Op;
const logger = require('../Config/loggerConfig')

exports.createMachine = async (req, res) => {
  const values = {
    name: req.body.name,
    english_name: req.body.english_name,
    timeUnit: req.body.timeUnit,
    maxUnit: req.body.maxUnit,
    machineState: req.body.machineState,
    additionalInfo:req.body.additionalInfo,
    workshopId: req.body.workshopId
  }

  const { error } = MachineValidation(values);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const machine = await db.Machine.create(values);
    res.send({ id: machine.id });
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getGuestList'})
  }
};
exports.removeMachine = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id);
  if (!machine) return res.status(400).send('Problem occurred while finding this machine');
  try {
    await db.Machine.destroy({ where: { id: req.params.id } }); 
    res.send({ok:true});
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getGuestList'})
  }
};
exports.updateMachine = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id);
  if (!machine) return res.status(400).send('Problem occurred while finding this machine');
  const values = {
    name: req.body.name,
    english_name: req.body.english_name,
    timeUnit: req.body.timeUnit,
    maxUnit: req.body.maxUnit,
    machineState: req.body.machineState,
    additionalInfo:req.body.additionalInfo,
    workshopId: req.body.workshopId
  }
  const { error } = MachineValidation(values);
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    await db.Machine.update(values,{ where: { id: machine.id } }
    );
    if(req.body.machineState===false){
      res.on('finish',async function(){
       await sendMachineSuspendedEmails(req.params.id,db)
      })
    }
    
    res.send({ id: machine.id });
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getGuestList'})
  }
};
exports.getAllMachine = async (req, res) => {
  
  try {
    const machines = await db.Machine.findAll({include:[{model:db.Workshop}]})
    res.send(machines);
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getGuestList'})
  }
};
exports.getMachineById = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id,{include:db.Reservation});
  if (!machine) return res.status(404).send('Machine was not found');
  res.send(machine);
};
exports.getMachineSupervisors = async (req,res)=>{
  const supervisors = await db.Machine.findByPk(req.params.id,
    {include:{model:db.Workshop,
      include:[{model:db.Employee,include:{model:db.User,attributes:['firstName','lastName','id']}},
      {model:db.Lab,include:{model:db.Employee,include:{model:db.User,attributes:['firstName','lastName','id']}}}]}});
  const tempUsers = [];
  supervisors.Workshop.Lab.Employee && tempUsers.push(supervisors.Workshop.Lab.Employee.User)
  supervisors.Workshop.Employees && supervisors.Workshop.Employees.forEach((emp)=>{
    tempUsers.push(emp.User)
  })
  let users = _.uniqBy(tempUsers,'id')
  res.send(users)
}
exports.getMachineList = async (req,res)=>{
  res.send(res.filteredResults);
}
