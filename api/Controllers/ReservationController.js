const db = require('../../database/models/index')
const {sendSupervisorEmails,sendToDepartmentHeadMessage} = require('../EmailService/messages')
const {sendMessage} = require('../EmailService/config')
const { ReservationValidation } = require('../Validation/resource')
const uniqBy = require('lodash/uniqBy')
const {ReservationTypes} = require('../Utils/translations')
const logger = require('../Config/loggerConfig')
const Op = db.Sequelize.Op;

exports.createReservation = async (req, res) => {
  let data = req.body;
  let employee = await db.Employee.findOne({where:{userId:req.user.id},include:db.User})

  const machine = await db.Machine.findByPk(data.machineId)
  if(!employee) return res.status(400).send({ok:false})

  data.employeeId = employee.id;

  const { error } = ReservationValidation(data);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const reservation = await db.Reservation.create({
      state:ReservationTypes.PENDING,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId});

    res.on('finish',function(){
      sendSupervisorEmails(data.machineId,db,'Nowa rezerwacja w systemie',
      `Została złożona nowa rezerwacja na maszynę: ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)

      sendMessage(employee.User.email,'Potwierdzenie rezerwacji',
      `Potwierdzenie złożenia rezerwacji na maszynę ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)

      sendToDepartmentHeadMessage(reservation)
    })
    res.send({ok:true});
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'createReservation'})
  }
};
exports.updateReservation = async(req,res)=>{
  let data = req.body;
  let employee = await db.Employee.findOne({where:{userId:req.user.id},include:db.User})
  const machine = await db.Machine.findByPk(data.machineId)
  if(!employee) return res.status(400).send({ok:false})
  data.employeeId = employee.id;

  const { error } = ReservationValidation(data);
  if (error) return res.status(400).send(error.details[0].message);

  try{
    await db.Reservation.update({state:ReservationTypes.PENDING,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId
    },{where:{id:req.params.id}})
    await db.ReservationDeclineComment.destroy({where:{reservationId:req.params.id}})

    res.on('finish',function(){
      sendSupervisorEmails(data.machineId,db,'Rezerwacja - aktualizacja',
      `Aktualizacja rezerwacji na maszynę: ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)
      sendMessage(employee.User.email,'Potwierdzenie aktualizacji rezerwacji',
      `Potwierdzenie aktualizacji rezerwacji na maszynę ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'updateReservation'})
  }
}
exports.cancelReservation = async(req,res)=>{
  const reservation = await db.Reservation.findByPk(req.params.id,{include:db.Machine})
  const user = await db.Employee.findByPk(reservation.employeeId,{include:db.User})
  try{
    await db.Reservation.destroy({where:{id:req.params.id}});
    res.on('finish',function(){
      sendSupervisorEmails(reservation.machineId,db,'Rezerwacja - usunięty rekord',
      `Została usunięta rezerwacja na maszynę: ${reservation.Machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)
      sendMessage(user.User.email,'Potwierdzenie usunięcia rezerwacji',
      `Potwierdzenie usunięcia rezerwacji na maszynę ${reservation.Machine.name}.
      początek: ${new Date(reservation.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(reservation.end_date).toLocaleString('pl-PL')} `)
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'cancelReservation'})
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
    res.send(err);
    logger.error({message: err, method: 'getAllReservation'})
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
    res.send(err);
    logger.error({message: err, method: 'getMachineReservation'})
  }
};
exports.getAllSupervisedReservation = async (req,res)=>{ 
  const userId = req.user.id;
    const employee = await db.Employee.findOne({where:{userId:userId},include:{model:db.Lab}})
    let labSupervised = []
  try{
    
    if(employee.Lab!==null){
      labSupervised = 
    await db.Reservation.findAll({attributes:['id','state','start_date','end_date',],include:
    {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
    {model:db.Workshop,attributes:['id','name','english_name'],required:true,where:{labId:employee.Lab.id}}}})
  }
    const workshopSupervised = await db.Reservation.findAll({attributes:['id','state','start_date','end_date',],include:
    {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
    {model:db.Workshop,attributes:['id','name','english_name'],required:true,include:{model:db.Employee,where:{userId:userId}}}}});

    let tempArray = [];
    tempArray.push(...labSupervised)
    tempArray.push(...workshopSupervised)
    let unique = uniqBy(tempArray,'id');
    res.send(unique)
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'getAllSupervisedReservation'})
  }
}
exports.getAllOwnedReservation = async (req,res)=>{
  try{
    const reservations = await db.Reservation.findAll({include:[
      {model:db.Employee,where:{userId:req.user.id}},
      {model:db.Machine,required: true,include:db.Workshop,},{model:db.ReservationSurvey}]})    
    res.send(reservations)
  }catch(err)
  {
    res.send(err.detail)
    logger.error({message: err, method: 'getAllOwnedReservation'})
  }
}
exports.getReservationById = async (req,res)=>{
  const reservation = await db.Reservation.findOne({where:{id:req.params.id},
    include:[{model:db.Employee,include:db.User},{model:db.Machine},{model:db.ReservationSurvey},{model:db.ReservationDeclineComment}]
    })
  res.send(reservation)
}
exports.updateReservationState = async (req,res)=>{
  const reservation = await db.Reservation.findByPk(req.params.id,{include:db.Machine})
  if(!reservation) return res.status(400).send({ok:false})

  const employee = await db.Employee.findOne({where:{id:reservation.employeeId},include:{model:db.User}})
  const {comment,commentHTML} = req.body;
  try
    {if(req.body.accept===true){
      await reservation.update({state:ReservationTypes.ACCEPTED});

      await db.ReservationDeclineComment.destroy({where:{reservationId:req.params.id}})

      sendMessage(employee.User.email,'Akceptacja Rezerwacji',
      `Potwierdzenie akceptacji rezerwacji na maszynę ${reservation.Machine.name}.
      początek: ${new Date(reservation.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(reservation.end_date).toLocaleString('pl-PL')} `)

      sendToDepartmentHeadMessage(reservation)

      res.send({ok:true})
    }else{
      await db.ReservationDeclineComment.create({reservationId:reservation.id,comment:comment})

      await reservation.update({state:ReservationTypes.DECLINED});

      sendMessage(employee.User.email,'Odrzucenie Rezerwacji',
      `Potwierdzenie odrzucenia rezerwacji na maszynę ${reservation.Machine.name}.
      Początek: ${new Date(reservation.start_date).toLocaleString('pl-PL')},
      Koniec: ${new Date(reservation.end_date).toLocaleString('pl-PL')} `,commentHTML)

      res.send({ok:true})
    }
  }
    catch(err)
    {
      res.send(err)
      logger.error({message: err, method: 'updateReservationState'})
    }
}
exports.upcomingReservations = async (req,res)=>{
  const today = new Date()
  let tomorrow =  new Date()
  
  tomorrow.setDate(today.getDate() + 1)  
  const upcomingReservations = await db.Reservation.findAll({where:{start_date:{[Op.gte]:today}},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
  res.send(upcomingReservations)
}
exports.latestReservations = async (req,res)=>{
  const today = new Date()
  let yesterday =  new Date()
  yesterday.setDate(today.getDate() -1)
  const latestReservations = await db.Reservation.findAll({where:{end_date:{[Op.lt]:today,[Op.gte]:yesterday}},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
  res.send(latestReservations)
}
exports.sendSurvey = async(req,res)=>{
  const reservation = await db.Reservation.findByPk(req.params.id,{include:[{model:db.ReservationSurvey},{model:db.Machine}]})
  if(reservation.ReservationSurvey!==null) return res.send('Ankieta została już wypełniona')
  await db.ReservationSurvey.create({reservationId:req.params.id,comment:req.body.comment})
  const employee = await db.Employee.findOne({where:{id:reservation.employeeId},include:db.User})
  res.on('finish',function(){
    sendSupervisorEmails(reservation.machineId,db,'Dodano komentarz do rezerwacji',
      `Została złożona nowa ankieta po rezerwacji na maszynę: ${reservation.Machine.name}.
      początek: ${new Date(reservation.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(reservation.end_date).toLocaleString('pl-PL')} `)
      sendMessage(employee.User.email,'Potwierdzenie rezerwacji',
      `Została złożona nowa ankieta po rezerwacji na maszynę: ${reservation.Machine.name}.
      początek: ${new Date(reservation.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(reservation.end_date).toLocaleString('pl-PL')} `)
  })
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

exports.getCancelReservationForm =async(req,res)=>{
  const emp = await db.Employee.findOne({where:{userId:req.user.id}})
  const declineForm =await db.ReservationDeclineComment.findOne({where:{reservationId:req.params.id}})
  if(declineForm!==null) return res.status(400).send({ok:false});

  res.send({ok:true})
  // const reservation =await db.Reservation.findOne({where:{id:req.params.id},include:[
  //   {model:db.Machine,include:[
  //     {model:db.Workshop,include:[{model:db.Employee},{model:db.Lab}]}]},]})
  // console.log(reservation.Machine.Workshop.Employees)
  // console.log(reservation.Machine.Workshop.Lab)
  //powód odrzucenia lub komentarz po zakończonej
  // if(!reservation || reservation.ReservationSurvey!==null) return res.status(400).send({ok:false})
  
}