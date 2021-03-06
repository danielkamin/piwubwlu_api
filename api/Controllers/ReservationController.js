const db = require('../../database/models/index')
const {sendSupervisorEmails,sendToDepartmentHeadMessage} = require('../EmailService/messages')
const {sendMessage} = require('../EmailService/config')
const { EventValidation } = require('../Validation/resource')
const {ReservationState, UserRoles,ReservationSugestedState,UserTypes} = require('../Utils/constants')
const uniqBy = require('lodash/uniqBy')
const logger = require('../Config/loggerConfig')
const Op = db.Sequelize.Op;
const lodash = require('lodash')
async function getSupervisedReservations(userId){
  const workshopSupervised = await db.Reservation.findAll({attributes:['id','state','start_date','end_date',],include:
    {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
    {model:db.Workshop,attributes:['id','name','english_name'],required:true,include:{model:db.Employee,where:{userId:userId}}}}});
  
  return workshopSupervised
}
async function getOwnedReservations(userId){
  const owned = await db.Reservation.findAll({include:[
    {model:db.Employee,where:{userId:userId}},
    {model:db.Machine,required: true,include:db.Workshop},{model:db.ReservationSurvey}]}) 
  return owned
}

exports.createReservation = async (req, res) => {
  let data = req.body;
  let employee = await db.Employee.findOne({where:{userId:req.user.id},include:db.User})

  const machine = await db.Machine.findByPk(data.machineId)
  if(!employee) return res.status(400).send({ok:false})

  data.employeeId = employee.id;

  const { error } = EventValidation(data);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const reservation = await db.Reservation.create({
      state:ReservationState.EVALUATION,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId,
      sugestedState:ReservationSugestedState.ACCEPTED,
      reservationPurpose:data.reservationPurpose});
      
    if(req.body.comment!==null){
      await db.ReservationComment.create({
        reservationId:reservation.id,
        comment:req.body.comment,
        userId:req.user.id
      })
    }
    await db.ReservationRequiredUser.create({
      reservationId:reservation.id
    })
    await db.ReservationHistoryChange.create({
      userId:req.user.id,
      reservationId:reservation.id,
      description:`Utworzenie prośby o rezerwację przez: ${req.user.userName}`
    })
    res.on('finish',function(){
      sendSupervisorEmails(data.machineId,db,'Nowa rezerwacja w systemie',
      `Została złożona nowa rezerwacja na maszynę: ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)

      sendMessage(employee.User.email,'Potwierdzenie rezerwacji',
      `Potwierdzenie złożenia rezerwacji na maszynę ${machine.name}.
      początek: ${new Date(data.start_date).toLocaleString('pl-PL')}
      koniec: ${new Date(data.end_date).toLocaleString('pl-PL')} `)

    })
    res.send({ok:true});
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'createReservation'})
  }
};
exports.updateReservation = async(req,res)=>{
  const id = req.params.id
  let data = req.body;
  let employee = await db.Employee.findOne({where:{userId:req.user.id},include:db.User})
  const machine = await db.Machine.findByPk(data.machineId)
  if(!employee) return res.status(400).send({ok:false})
  data.employeeId = employee.id;

  const { error } = EventValidation(data);
  if (error) return res.status(400).send(error.details[0].message);

  
  try{
    await db.Reservation.update({
      state:ReservationState.EVALUATION,
      start_date:data.start_date,
      end_date:data.end_date,
      employeeId:data.employeeId,
      machineId:data.machineId,
      sugestedState:ReservationSugestedState.ACCEPTED,
      reservationPurpose:data.reservationPurpose
    },{where:{id:id}})

    if(req.body.comment){
      await db.ReservationRequestComment.update({
        comment:req.body.comment
      },{where:{reservationId:id}})
    }

    await db.ReservationHistoryChange.create({
      userId:req.user.id,
      reservationId:id,
      description:`Aktualizacja prośby o rezerwację przez: ${req.user.userName}`
    })
    
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
  try{
    if(req.user.role.indexOf(UserRoles.SUPERVISOR)!==-1){
      const supervised = await getSupervisedReservations(userId)
      return res.send(supervised)
    }
    else{
      return res.send([])
    }
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'getAllSupervisedReservation'})
  }
}
exports.getAllOwnedReservation = async (req,res)=>{
  try{
    const reservations = await  getOwnedReservations(req.user.id)    
    res.send(reservations)
  }catch(err)
  {
    res.send(err.detail)
    logger.error({message: err, method: 'getAllOwnedReservation'})
  }
}
exports.getReservationById = async (req,res)=>{
  const reservation = await db.Reservation.findOne({
    where:{id:req.params.id},
    include:[
      {model:db.Employee,include:db.User},
      {model:db.Machine},
      ]
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



/* START - RESERVATION FLOW METHODS */
exports.reservationStatus = async (req,res)=>{
  try{
    const reservation = await db.Reservation.findByPk(req.params.id,{
      include:[
        {model:db.Machine},
        {model:db.ReservationComment,include:db.User},
        {model:db.ReservationSurvey},
        {model:db.ReservationHistoryChange},
        {model:db.ReservationRequiredUser,include:db.User}],
        order:[['ReservationComments','createdAt','DESC'],['ReservationHistoryChanges','createdAt','DESC']]
    })
    res.send(reservation)
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'reservationStatus'})
  }
}
exports.selectedReservationRole = async (req,res)=>{
  try{
    let statusCodes = []
    const currentUserId = req.user.id
    const reservation = await db.Reservation.findByPk(req.params.id,{include:[
      {model:db.Machine,include:{model:db.Workshop,include:[{model:db.Employee},{model:db.Lab,include:{model:db.Department,include:{model:db.DepartmentHead,include:db.Employee}}}]}},
      {model:db.Employee,include:db.User}]})
    if(reservation.Employee.userId === currentUserId){
      statusCodes.push(0)
    }  
    else if(lodash.findIndex(reservation.Machine.Workshop.Employees,(emp)=>{return emp.userId === currentUserId})!==-1){
      statusCodes.push(1)
    }
    else if(reservation.Machine.Workshop.Lab.Department.DepartmentHead.Employee.userId===currentUserId){
      statusCodes.push(2)
    }
    console.log(statusCodes)
    if(statusCodes.length<1){
      return res.send(null)
    }else{
      
      return res.send(statusCodes)
    }
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'reservationStatus'})
  }
}
exports.saveReservationComment = async (req,res)=>{
  try{
    await db.ReservationComment.create({
      reservationId:req.params.id,
      userId:req.user.id,
      comment:req.body.comment
    })  
    await db.ReservationHistoryChange.create({
      userId:req.user.id,
      reservationId:req.params.id,
      description:`Dodanie komentarza przez użytkownika ${req.user.userName}`
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'saveReservationData'})
  }
}
exports.passToBooker = async (req,res)=>{
  try{
    const reservation = await db.Reservation.findByPk(req.params.id)
    if(!reservation)
      return res.status(400).send({ok:false,message:'reservation not found'})

    switch(reservation.sugestedState)
    {
      case ReservationSugestedState.ACCEPTED:
        await reservation.update({state:ReservationState.ACCEPTED})
        break;
      case ReservationSugestedState.DECLINED:
        await reservation.update({state:ReservationState.DECLINED})
        break;
      case ReservationSugestedState.CORRECT:
        await reservation.update({state:ReservationState.PENDING})
        break;
      default:
        return res.status(400).send({ok:false,message:'nieznany error z metody passToBooker'})
    }     
  }catch(er){
    res.send(err)
    logger.error({message: err, method: 'passToBooker'})
  }
}
exports.passToWorkshopSupervisor = async (req,res)=>{
  try{
    const reservation = await db.Reservation.findByPk(req.params.id)
    if(!reservation)
      return res.status(400).send({ok:false,message:'reservation not found'})
    if(reservation.state===ReservationState.PENDING){
      await reservation.update({state:ReservationState.EVALUATION})
    }else{
      await reservation.update({state:ReservationState.APPROVAL})
    }
    
  }catch(er){
    res.send(err)
    logger.error({message: err, method: 'passToWorkshopSupervisor'})
  }
}
exports.passToDepartmentHead = async (req,res)=>{
  try{
    const reservation = await db.Reservation.findByPk(req.params.id)
    if(!reservation)
      return res.status(400).send({ok:false,message:'reservation not found'})
    await reservation.update({state:ReservationState.VERIFICATION})
  }catch(er){
    res.send(err)
    logger.error({message: err, method: 'passToDepartmentHead'})
  }
}
exports.changeReservationSettings = async (req,res)=>{
  const id = req.params.id
  try{
    //jeżeli zaakceptowana lub odrzucona to z powrotem status na ewaluacja
    if(req.body.userType===UserTypes.OTHER){
      if(req.body.name!=='')
      {
        await db.ReservationRequiredUser.update(
          {name:req.body.name,
          userType:req.body.userType},
          {where:{reservationId:id}})
      }
    }else{
      if(req.body.userId!==-1){
        await db.ReservationRequiredUser.update(
          {userId:+req.body.userId,
          userType:req.body.userType},
          {where:{reservationId:id}})
      }      
    }
    await db.Reservation.update({sugestedState:req.body.sugestedState},{where:{id:id}})
    await db.ReservationHistoryChange.create({
      userId:req.user.id,
      reservationId:id,
      description:`Zmiana wymaganej osoby/sugerowanego stanu rezerwacji ${req.user.userName}`
    })
    res.send({ok:true})
  }catch(err){
    res.send(err)
    logger.error({message: err, method: 'changeReservationSettings'})
  }
}
/* END - RESERVATION FLOW METHODS */