const db = require('../../database/models')
const {sendMessage,sendMachineSuspendedEmails} = require('../Utils/emailConfig')
const { MachineValidation } = require('../Validation/resource')
const Op = db.Sequelize.Op;
exports.createMachine = async (req, res) => {
  const { error } = MachineValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    timeUnit: req.body.timeUnit,
    maxUnit: req.body.maxUnit,
    machineState: req.body.machineState,
    workshopId: req.body.workshopId
  });
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const machine = await db.Machine.create(req.body);
    res.send({ id: machine.id });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.removeMachine = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id);
  if (!machine) return res.status(400).send('Problem occurred while finding this machine');
  try {
    await db.Machine.destroy({ where: { id: req.params.id } }); 
    res.send({ok:true});
  } catch (err) {
    res.send(err.sql);
  }
};
exports.updateMachine = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id);
  if (!machine) return res.status(400).send('Problem occurred while finding this machine');
  console.log(req.body)
  const { error } = MachineValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    timeUnit: req.body.timeUnit,
    maxUnit: req.body.maxUnit,
    machineState: req.body.machineState,
    workshopId: req.body.workshopId
  });
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    console.log(req.body)
    await db.Machine.update(
      {
        name: req.body.name,
        english_name: req.body.english_name,
        timeUnit: req.body.timeUnit,
        maxUnit: req.body.maxUnit,
        machineState: req.body.machineState,
        workshopId: req.body.workshopId
      },
      { where: { id: machine.id } }
    );
    if(req.body.machineState===false){
      res.on('finish',async function(){
       await sendMachineSuspendedEmails(req.params.id,db)
      })
    }
    
    res.send({ id: machine.id });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.getAllMachine = async (req, res) => {
  
  try {
    const machines = await db.Machine.findAll({include:[{model:db.Workshop}]})
    res.send(machines);
  } catch (err) {
    res.send(err);
  }
};
exports.getMachineById = async (req, res) => {
  const machine = await db.Machine.findByPk(req.params.id,{include:db.Reservation});
  if (!machine) return res.status(404).send('Machine was not found');
  res.send(machine);
};
exports.getMachineList = async (req,res)=>{
  const name = (req.query.q===undefined)?'':(req.query.q)
  try {
    let machineList=[];
    switch(req.query.sort){
      case 'asc':
        machineList= await db.Machine.findAll({
          attributes: ['id', 'name','english_name','imagePath'],order:[['name','ASC']],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
      case 'desc':
        machineList= await db.Machine.findAll({
          attributes: ['id', 'name','english_name','imagePath'],order:[['name','DESC']],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
      default:
        machineList= await db.Machine.findAll({
          attributes: ['id', 'name','english_name','imagePath'],where:{name:{[Op.iLike]:'%'+name+'%'}}
        });
        break;
    }
    res.send(machineList);
  } catch (err) {
    res.send(err.sql);
  }
}