
const cron = require( 'node-cron')
const {sendMessage} = require('./config')

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
      latestReservations.forEach(async (item)=>{
        await item.update({state:ReservationTypes.FINISHED})
      })
    },{scheduled:true,timezone:"Europe/Warsaw"})
}
  