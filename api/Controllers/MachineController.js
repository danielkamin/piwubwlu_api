const db = require('../../database/models')
const {sendMessage} = require('../EmailService/config')
const {sendMachineSuspendedEmails} = require('../EmailService/messages')
const { MachineValidation } = require('../Validation/resource')
const {negativeIdToNull} = require('../Utils/helpers')
const Op = db.Sequelize.Op;
const logger = require('../Config/loggerConfig')

const searchAndSort =async (type,req)=>{
  let results = []
  const attributesArray = ['id', 'name','english_name','imagePath','resourceType']
  const name = (req.query.q===undefined)?'':(req.query.q)
  switch(req.query.sort){
      case 'asc':
          results= await db.Machine.findAll({
          attributes:attributesArray ,
          order:[['name','ASC']],
          where:{name:{[Op.iLike]:'%'+name+'%'},resourceType:type}
      });
      break;
      case 'desc':
          results= await db.Machine.findAll({
          attributes: attributesArray,
          order:[['name','DESC']],
          where:{name:{[Op.iLike]:'%'+name+'%'},resourceType:type}
      });
      break;
      default:
          results= await db.Machine.findAll({
          attributes: attributesArray,
          where:{name:{[Op.iLike]:'%'+name+'%'},resourceType:type}
      });
      break;
  }
  return results;
}

exports.createMachine = async (req, res) => {
  const values = {
    name: req.body.name,
    english_name: req.body.english_name,
    timeUnit: req.body.timeUnit,
    maxUnit: req.body.maxUnit,
    machineState: req.body.machineState,
    additionalInfo:req.body.additionalInfo,
    workshopId: req.body.workshopId,
    delayTime:req.body.delayTime,
    resourceType:req.body.resourceType
  }
  
  const { error } = MachineValidation(values);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const machine = await db.Machine.create(values);
    res.send({ id: machine.id });
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'createMachine'})
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
    workshopId: negativeIdToNull(req.body.workshopId),
    delayTime:req.body.delayTime,
    resourceType:req.body.resourceType
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
    logger.error({message: err, method: 'getAllMachine'})
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
      include:{model:db.Employee,
        include:{model:db.User,attributes:['firstName','lastName','id']}}}});
  let users = [];
  supervisors.Workshop.Employees && supervisors.Workshop.Employees.forEach((emp)=>{
    users.push(emp.User)
  })
  res.send(users)
}
exports.getMachineList = async (req,res)=>{ 
  const results  = await searchAndSort('MACHINE',req)
  res.send(results);
}

exports.getSoftwareList = async (req,res)=>{
  const results  = await searchAndSort('SOFTWARE',req)
  res.send(results);
}
