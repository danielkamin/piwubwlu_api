const db = require('../../database/models')
const logger = require('../Config/loggerConfig')


/* ROCZNE - 12 MIESIĘCY ZESTAWIONE */

exports.getYearlyStatistics = async (req, res) => {
  const reservations = await db.Reservation.findAll({ where: { machineId: req.query.id } });
  const groups = reservations.reduce((groups, reservation) => {
    const date = reservation.start_date.getMonth();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000);
    return groups;
  }, {});

  const groupArrays = Object.keys(groups).map((date) => {
    let amountOfMinutes = 0;
    groups[date].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      date,
      time: amountOfMinutes
    };
  });

  res.send(groupArrays)
}

/* END ROCZNE */



/* MIESIĘCZNE - STATYSTYKI Z POJEDYNCZEGO MIESIĄCA */

exports.getMonthlyMachineStatistics = async (req, res) => {

  try{

  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMonthlyMachineStatisticsByPurpose'})
  }

}

/* END MIESIĘCZNE */



/* DLA POJEDYNCZEGO PRACOWNIKA ROCZNE I MIESIĘCZNE */

exports.getPersonalStatisticsByMonth = async (req, res) => {
  console.log(req.params)
  const reservations = await db.Reservation.findAll({ 
    where: { machineId: req.params.id },
    include:{model:db.Employee,
      include:{model:db.User,attributes:['id','firstName','lastName']},} });
  
  const groups = reservations.reduce((groups,reservation)=>{
    const user = JSON.stringify(reservation.Employee.User);
    if(!groups[user]){
      groups[user] = [];
    }
    groups[user].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000)
    return groups;
  },[])
  const groupArrays = Object.keys(groups).map((user) => {
    let amountOfMinutes = 0;
    groups[user].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      user,
      time: amountOfMinutes
    };
  });
  res.send(groupArrays)
}

exports.getPersonalStatisticsByYear= async (req, res) => {
  console.log(req.params)
  const reservations = await db.Reservation.findAll({ 
    where: { machineId: req.params.id },
    include:{model:db.Employee,
      include:{model:db.User,attributes:['id','firstName','lastName']},} });
  
  const groups = reservations.reduce((groups,reservation)=>{
    const user = JSON.stringify(reservation.Employee.User);
    if(!groups[user]){
      groups[user] = [];
    }
    groups[user].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000)
    return groups;
  },[])
  const groupArrays = Object.keys(groups).map((user) => {
    let amountOfMinutes = 0;
    groups[user].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      user,
      time: amountOfMinutes
    };
  });
  res.send(groupArrays)
}
