const nodemailer = require('nodemailer')
const {ReservationTypes} = require('./constants')
Array.prototype.move = function (from,to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}
const emailSettings = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure:true,
  requireTLS: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
});
exports.verifyTransport = ()=>{
  emailSettings.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
}
/**
 * Returns x raised to the n-th power.
 *
 * @param {string} email Recipient address.
 * @param {string} subject Subject of the message.
 * @param {string} messageBody Text included in message's body.
 * @return asynchronusly sends email message.
 */
exports.sendMessage = (email, subject, messageBody)=>{  
  console.log(emailSettings)
    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      text: messageBody,
    };
    console.log(message)
    emailSettings.sendMail(message,(error,info)=>{
      if(error){
        console.log(error)
      }else{
        
        console.log('Email sent to: '+info.response)
      }
    });
}
/**
 * Configuration function, that sets up e-mail sending cron jobs for the server
 * @param {Object} cron 
 * @param {Object} db 
 */
exports.cronSetup = (cron,db)=>{
  const Op = db.Sequelize.Op;
  cronUpcomingReservations(cron,db,Op)
  cronSurveyReminder(cron,db,Op)
  cronReservationStateChange(cron,db,Op)
}

const cronUpcomingReservations = async (cron,db,Op)=>{
  cron.schedule('10 12 * * *',async ()=>{
    const today = new Date()
    let tomorrow =  new Date()
    tomorrow.setDate(today.getDate() + 1)
    const upcomingReservations = await db.Reservation.findAll({where:{start_date:{[Op.lt]:tomorrow,[Op.gte]:today},state:ReservationTypes.ACCEPTED},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
    upcomingReservations.forEach(item=>{
      const machine = item.Machine.name;
      const email = item.Employee.User.email;
      const startDate = new Date(item.start_date);
      sendMessage(email,'Zbliżająca się rezerwacja',`Przypomnienie o zbliżającej się rezerwacji ${machine}, rozpoczynającej się o ${startDate}`)
    })
  },{scheduled:true,timezone:"Europe/Warsaw"})
}
const cronSurveyReminder = async (cron,db,Op)=>{
  cron.schedule('12 12 * * *',async()=>{
    const today = new Date()
    let yesterday =  new Date()
    yesterday.setDate(today.getDate() -1)
    const latestReservations = await db.Reservation.findAll({where:{end_date:{[Op.lt]:today,[Op.gte]:yesterday},state:ReservationTypes.FINISHED},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
    latestReservations.forEach(item=>{
      const machine = item.Machine.name;
      const email = item.Employee.User.email;
      const endDate = new Date(item.end_date);
      sendMessage(email,'Zbliżająca się rezerwacja',`Przypomnienie o wypełnieniu ankiety dotyczącej byłej rezerwacji na maszynę: ${machine}, która się zakończyła o ${endDate}`)
    })
  },{scheduled:true,timezone:"Europe/Warsaw"})
  
}
const cronReservationStateChange = async(cron,db,Op)=>{
  cron.schedule('0 22 * * *',async()=>{
    const today = new Date()
    let yesterday =  new Date()
    yesterday.setDate(today.getDate() -1)
    const latestReservations = await db.Reservation.findAll({where:{end_date:{[Op.lt]:today,[Op.gte]:yesterday}}})
    latestReservations.forEach(async (item)=>{
      await item.update({state:ReservationTypes.FINISHED})
    })
  },{scheduled:true,timezone:"Europe/Warsaw"})
}

exports.sendSupervisorEmails = async (machineId,db,title)=>{
  let supervisors = await db.Machine.findByPk(machineId,{include:{model:db.Workshop,include:[{model:db.Employee,include:db.User},{model:db.Lab,include:{model:db.Employee,include:db.User}}]}})
  const workshopSupervisorsOrder = await db.WorkshopSupervisor.findAll({where:{WorkshopId:supervisors.Workshop.id}})
  /* All workshop supervisors */
  // const workshopSuperEmails = supervisors.Workshop.Employees.map(emp=>{
  //   return emp.User.email
  // });
  // workshopSuperEmails !==null && workshopSuperEmails.forEach(item=>{
  //   sendMessage(item,'Nowa rezerwacja',`Została złożona nowa prośba na maszynę: ${supervisors.name}`)
  // })

  /* First on the list */ 
  let firstSupervisorIndex = supervisors.Workshop.Employees.map((item)=>{
    return item.id
  }).indexOf(workshopSupervisorsOrder[0].EmployeeId)
  try{
    const workshopSupervisorEmail = supervisors.Workshop.Employees[firstSupervisorIndex].User.email
    workshopSupervisorEmail !==null && sendMessage(workshopSupervisorEmail,title,`Została złożona nowa prośba na maszynę: ${supervisors.name}`)
    supervisors.Workshop.Lab.Employee.User.email !==null && sendMessage(supervisors.Workshop.Lab.Employee.User.email,title,`Została złożona nowa prośba na maszynę: ${supervisors.name}`)
  }catch(err){
    console.log(err)
  }
}


exports.sendMachineSuspendedEmails = async (machineId,db)=>{
  const reservations = await db.Reservation.findAll({where:{machineId:machineId},include:[{model:db.Employee,include:db.User},{model:db.Machine}]})
  reservations.forEach(item=>{
    sendMessage(item.Employee.User.email,'Maszyna nieaktywna',`Wszytskie rezerwacje na maszynę ${item.Machine.name} zostały tymczasowo anulowane. Proszę o sprawdzanie statusu na paltformie`)
  })
}