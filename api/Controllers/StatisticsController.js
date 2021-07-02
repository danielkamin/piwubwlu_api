const db = require('../../database/models')
const logger = require('../Config/loggerConfig')
const Op = db.Sequelize.Op
const {ReservationState} = require('../Utils/constants')
const {getMachineReservationsByDepartmentId,getReservationsByMachine,groupAndReduceReservations} = require('../Utils/statsHelpers')
const Printer = require('../Config/PDF/config')
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
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const machineId = req.query.id
  if(!month || !machineId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)

  try{
    const response = await getReservationsByMachine(+machineId,startDate,endDate)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMonthlyMachineStatisticsByPurpose'})
  }

}

/* END MIESIĘCZNE */



/* DLA POJEDYNCZEGO PRACOWNIKA ROCZNE I MIESIĘCZNE */

exports.getPersonalStatisticsByMonth = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const machineId = req.query.id
  const employeeId = req.query.employee
  if(!month || !machineId || !employeeId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)

  try{
    const reservations = await db.Reservation.findAll({ 
      where: { machineId: +machineId,
        employeeId:employeeId,
        state:ReservationState.ENDED,
        start_date:{
          [Op.lt]:endDate,
          [Op.gte]:startDate
        } 
      }});
    const response = groupAndReduceReservations(reservations)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getMonthlyMachineStatisticsByPurpose'})
  }
}

exports.getPersonalStatisticsByYear= async (req, res) => {
  console.log(req.params)
  const reservations = await db.Reservation.findAll({ 
    where: { machineId: req.query.id },
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

exports.getDepartmentStatistics = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = req.query.month
  const departmentId = req.query.id
  if(!month || !departmentId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)
  try{
    const response = await getMachineReservationsByDepartmentId(req.query.id,startDate,endDate)
    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getDepartmentStatistics'})
  }
}

exports.exportDepartmentStatisticsPDF = async (req, res) => {
  const currentYear = new Date().getFullYear()
  const month = new Date().getMonth()
  const departmentId = req.query.id
  if(!departmentId) 
    return res.status(400).send({ok:false,message:'Podano złe parametry zapytania'})
  const startDate = new Date(currentYear,month)
  const endDate = new Date(currentYear,+month+1)
  try{
    const response = await getMachineReservationsByDepartmentId(departmentId,startDate,endDate)
    let docDefinition = {
      content:[
        { text: 'Wydziałowe centrum wypożyczeń aparatury badawczej', style: 'header' },
        'Testowy PDF wygenerowany ze statystykami danej katedry',
        {
          style: 'tableExample',
          table: {
            body: [
              ['Column 1', 'Column 2', 'Column 3'],
              ['One value goes here', 'Another one here', 'OK?']
            ]
          }
        },
      ]
    }

    res.send(response)
  }catch(err){
    res.send(err);
    logger.error({message: err, method: 'getDepartmentStatistics'})
  }
} 