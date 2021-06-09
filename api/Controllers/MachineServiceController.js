const { forEach } = require('lodash');
const db = require('../../database/models/index')
const logger = require('../Config/loggerConfig')
const { EventValidation } = require('../Validation/resource')
const {sendMessage} = require('../EmailService/config')
exports.createMachineService = async (req,res)=>{
    const employee = await db.Employee.findOne({where:{userId:req.user.id},include:db.User})
    if(!employee) return res.status(400).send({ok:false})
    const data = {
      start_date:req.body.start_date,
      end_date:req.body.end_date,
      employeeId:employee.id,
      machineId:req.params.id
    }
    const { error } = EventValidation(data);
    if (error) return res.status(400).send(error.details[0].message);
      try{
        const mS = await db.MachineService.create({
          start_date:data.start_date,
          end_date:data.end_date,
          employeeId:data.employeeId,
          machineId:data.machineId});

        req.body.collidingReservations.forEach(async (reservationId)=>{
          const reservation = await db.Reservation.findOne({where:{
            id:reservationId
          },include:[{model:db.Machine},{model:db.Employee,include:db.User}]})
          sendMessage(reservation.Employee.User.email,
            'Anulowanie Rezerwacji',
            `Ze względu na wprowadzenie serwisu na aparaturę: ${reservation.Machine.name}, twoja 
            początek: ${new Date(mS.start_date).toLocaleString('pl-PL')}
            koniec: ${new Date(mS.end_date).toLocaleString('pl-PL')}, 
            twoja rezerwacja odbywająca się od: ${new Date(reservation.start_date).toLocaleString('pl-PL')} do: ${new Date(reservation.start_date).toLocaleString('pl-PL')} została anulowana i nie będzie widoczna na platformie.`)
          await reservation.destroy()
        })
          res.send({ok:true})
      }catch(err){
          res.send(err);
          logger.error({message: err, method: 'createMachineService'})
      }
}

exports.getMachineServices = async (req,res)=>{
  try{
    const machineServices =  await db.MachineService.findAll({where:{machineId:req.params.id}})
    res.send(machineServices)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMachineServices'})
  }
}

exports.getMachineServiceById = async (req,res)=>{
  try {
    res.send({ok:true})
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getMachineServiceById'})
  }
}

exports.updateMachineService = async (req,res)=>{
  try {
    res.send({ok:true})
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'updateMachineService'})
  }
}

exports.deleteMachineService = async (req,res)=>{
  try {
    res.send({ok:true})
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'deleteMachineService'})
  }
}

exports.getMachineServicesByMachineId = async (req,res)=>{
  try {
    res.send({ok:true})
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getMachineServicesByMachineId'})
  }
}