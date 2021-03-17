const db = require('../../database/models/index')
const {sendMessage,sendSupervisorEmails} = require('../Utils/emailConfig')
const { ReservationValidation } = require('../Validation/resource')
const uniqBy = require('lodash/uniqBy')
const {ReservationTypes} = require('../Utils/constants')
const Op = db.Sequelize.Op;
exports.createReservation = async (req, res) => {
  let data = req.body;

  let employee = await db.Employee.findOne({where:{userId:req.user.id}})
  if(!employee) return res.status(400).send({ok:false})

  data.employeeId = employee.id;
  const { error } = ReservationValidation(data);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await db.Reservation.create({
      state:ReservationTypes.PENDING,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId});
    res.on('finish',async function(){
      await sendSupervisorEmails(data.machineId,db,'Rezerwacja - nowa w systemie')
    })
    res.send({ok:true});
  } catch (err) {
    res.send(err);
  }
};
exports.updateReservation = async(req,res)=>{
  let data = req.body;
  let employee = await db.Employee.findOne({where:{userId:req.user.id}})
  if(!employee) return res.status(400).send({ok:false})
  data.employeeId = employee.id;
  console.log(data)
  const { error } = ReservationValidation(data);
  if (error) return res.status(400).send(error.details[0].message);
  try{
    await db.Reservation.update({state:ReservationTypes.PENDING,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId
    },{where:{id:req.params.id}})
    res.on('finish',async function(){
      await sendSupervisorEmails(data.machineId,db,'Rezerwacja - aktualizacja')
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
  }
}
exports.cancelReservation = async(req,res)=>{
  const reservation = await db.Reservation.findByPk(req.params.id)
  const user = await db.Employee.findByPk(reservation.employeeId,{include:db.User})
  try{
    await db.Reservation.destroy({where:{id:req.params.id}});
    res.on('finish',async function(){
      await sendSupervisorEmails(reservation.machineId,db,'Rezerwacja - usunięty rekord')
      sendMessage(user.User.email,'Usunięta rezerwacja','Z systemu została usunięta twoja rezerwacja. Po więcej szczegółów proszę odwiedzić platformę');
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
  }
}
//remove
const removeReservation = async (req) => {
  try {
    await db.Reservation.destroy({
      where: { id: req.params.id },
    });
  } catch (err) {
    res.send(err.sql);
  }
};
//getall
exports.getAllReservation = async (req, res) => {
  try {
    const reservations = await db.Reservation.findAll({include:
      {model:db.Machine,include:db.Workshop}})  
    res.send(reservations)
  } catch (err) {
    res.send(err.detail);
  }
};
//get by time interval
exports.getTimeReservation = async (req, res) => {
  try {

  } catch (err) {
    res.send(err.sql);
  }
};
//get by machine
exports.getMachineReservation = async (req, res) => {
  try {
    const reservations = await db.Reservation.findAll({where:{machineId:req.params.id},include:{model:db.Employee,include:db.User}})
    res.send(reservations)
  } catch (err) {
    res.send(err.sql);
  }
};
exports.getAllSupervisedReservation = async (req,res)=>{ 
  try{
    
    const userId = req.user.id;
    const employee = await db.Employee.findOne({where:{userId:userId},include:{model:db.Lab}})
    let labSupervised = []
    console.log(employee.toJSON())
    if(employee.Lab!=null){
      labSupervised = 
    await db.Reservation.findAll({attributes:['id','state','start_date','end_date',],include:
    {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
    {model:db.Workshop,attributes:['id','name','english_name'],required:true,where:{labId:employee.Lab.id}}}})
  }
    console.log(labSupervised)
    const workshopSupervised = await db.Reservation.findAll({attributes:['id','state','start_date','end_date',],include:
    {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
    {model:db.Workshop,attributes:['id','name','english_name'],required:true,include:{model:db.Employee,where:{userId:userId}}}}});
    let tempArray = [];
    tempArray.push(...labSupervised)
    tempArray.push(...workshopSupervised)
   let unique = uniqBy(tempArray,'id');
    res.send(unique)
  }catch(err)
  {res.send(err)}
}
exports.getAllOwnedReservation = async (req,res)=>{
  try{
    const reservations = await db.Reservation.findAll({include:[
      {model:db.Employee,where:{userId:req.user.id}},
      {model:db.Machine,include:db.Workshop},{model:db.ReservationSurvey}]})    
    res.send(reservations)
  }catch(err)
  {
    res.send(err.detail)
  }
}
exports.getReservationById = async (req,res)=>{
  const reservation = await db.Reservation.findOne({where:{id:req.params.id},
    include:[{model:db.Employee,include:db.User},{model:db.Machine},{model:db.ReservationSurvey}]
    })
  res.send(reservation)
}
exports.updateSupervisedState = async (req,res)=>{
  const reservation = await db.Reservation.findByPk(req.params.id,{include:db.Machine})
  if(!reservation) return res.status(400).send({ok:false})
  const employee = await db.Employee.findOne({where:{id:reservation.employeeId},include:{model:db.User}})
  try
    {if(req.body.accept===true){
      await reservation.update({state:ReservationTypes.ACCEPTED});
      //wiadomość maila
      sendMessage(employee.User.email,'Akceptacja Rezerwacji',`Rezerwacja na maszynę: ${reservation.Machine.name} została zaakceptowana`)
      res.send({ok:true})
    }else{
      await reservation.update({state:ReservationTypes.DECLINED});
      sendMessage(employee.User.email,'Odrzucenie Rezerwacji',`Rezerwacja na maszynę: ${reservation.Machine.name} została odrzucona`)
      res.send({ok:true})
    }
  }
    catch(err)
    {
      res.send(err)
    }
}
exports.upcomingReservations = async (req,res)=>{
  const today = new Date()
  let tomorrow =  new Date()
  console.log(today)
  
  tomorrow.setDate(today.getDate() + 1)  
  console.log(tomorrow)
  const upcomingReservations = await db.Reservation.findAll({where:{start_date:{[Op.gte]:today}},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
  res.send(upcomingReservations)
}
exports.latestReservations = async (req,res)=>{
  const today = new Date()
  let yesterday =  new Date()
  console.log(today)
  yesterday.setDate(today.getDate() -1)
  console.log(yesterday)
  const latestReservations = await db.Reservation.findAll({where:{end_date:{[Op.lt]:today,[Op.gte]:yesterday}},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
  res.send(latestReservations)
}
exports.sendSurvey = async(req,res)=>{
  console.log(req.body)
  const reservation = await db.Reservation.findByPk(req.params.id,{include:db.ReservationSurvey})
  if(reservation.ReservationSurvey!==null) return res.send('Ankieta została już wypełniona')
  await db.ReservationSurvey.create({reservationId:req.params.id,comment:req.body.comment})
  res.send({ok:true})
}
exports.getSurveyForm=async(req,res)=>{
  const emp = await db.Employee.findOne({where:{userId:req.user.id}})
  const reservation =await db.Reservation.findOne({where:{employeeId:emp.id,id:req.params.id},include:db.ReservationSurvey})
  if(!reservation || reservation.ReservationSurvey!==null) return res.status(400).send({ok:false})
  res.send({ok:true})
}
exports.isOwner = async (req,res)=>{
  const emp = await db.Employee.findOne({where:{userId:req.user.id}})
  const reservation =await db.Reservation.findOne({where:{employeeId:emp.id,id:req.params.id},include:db.ReservationSurvey})
  if(!reservation) return res.status(400).send({ok:false});
  res.send({ok:true});
}