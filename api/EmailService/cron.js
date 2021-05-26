
const cron = require( 'node-cron')
const {sendMessage} = require('./config')
const {sendMonthlyStatistics} = require('./messages')
/**
 * Configuration function, that sets up e-mail sending cron jobs for the server
 * @param {Object} cron 
 * @param {Object} db 
 */
exports.cronSetup = (db)=>{
    const Op = db.Sequelize.Op;
    cronUpcomingReservations(db,Op)
    cronSurveyReminder(db,Op)
    cronReservationStateChange(db,Op)
}
  //po zakończeniu pracy serwera wszystkie cron-job'y znikają
      //ustawienie cron-jobów po restarcie serwera
  

const cronUpcomingReservations = async (db,Op)=>{
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
const cronSurveyReminder = async (db,Op)=>{
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
const cronReservationStateChange = async(db,Op)=>{
    cron.schedule('0 22 * * *',async()=>{
      const today = new Date()
      let yesterday =  new Date()
      yesterday.setDate(today.getDate() -1)
      const latestReservations = await db.Reservation.findAll({where:{end_date:{[Op.lt]:today,[Op.gte]:yesterday}}})
      latestReservations.forEach((item)=>{
        item.update({state:ReservationTypes.FINISHED})
      })
    },{scheduled:true,timezone:"Europe/Warsaw"})
}

exports.newCronAction = (db,Op,eventEndDate,eventId) => {
    let minute = eventEndDate.getMinutes().toString(), 
    hour = eventEndDate.getHours().toString(), 
    day = eventEndDate.getDate().toString(), 
    month = eventEndDate.getMonth().toString(), 
    year = eventEndDate.getFullYear().toString();
    cron.schedule(`${minute} ${hour} ${day} ${month} *`,()=>{
      db.Reservation.update({state:ReservationTypes.FINISHED, where:{id:eventId}})
      
    })
}
  
const setMonthlyStatisticsNewsLetter = () =>{
  cron.schedule(`0 22 1 1-12 *`,()=>{

  })
}