const db = require('../../database/models')
const logger = require('../Config/loggerConfig')
const {ReservationState} = require('./constants')
const Op = db.Sequelize.Op
/**
 * * Function that returns reservations for every machine in a given department and given month
 * @param {number} departmentId 
 * @param {*} firstDateOfTheMonth 
 * @param {*} firstDayOfTheNextMonth 
 * @returns {Object} object with machine names as keys 
 */
const getMachineReservationsByDepartmentId = async (departmentId,firstDateOfTheMonth,firstDayOfTheNextMonth)=>{
  const department = await db.Department.findByPk(+departmentId,{
    include:{model:db.Lab}})
  let response={};
  const labs = department.Labs
  let labsLength = labs.length
  for(let i=0;i<labsLength;i++){
    let data =await getReservationsByLab(labs[i].id,firstDateOfTheMonth,firstDayOfTheNextMonth)
    response[labs[i].name] = data
  }
  return response
  }

const getReservationsByLab = async (labId,startDate,endDate) =>{
  let response={};
  const lab = await db.Lab.findByPk(labId,{include:db.Workshop})
  const workshops = lab.Workshops
  let workshopsLength = workshops.length
  for(let i=0;i<workshopsLength;i++){
    let data = await getReservationsByWorkshop(workshops[i].id,startDate,endDate)
    response[workshops[i].name] = data
  }
  return response
}

const getReservationsByWorkshop = async (workshopId,startDate,endDate) =>{
  let response={};
  const workshop = await db.Workshop.findByPk(workshopId,{include:db.Machine})
  const machines = workshop.Machines
  let machinesLength = machines.length
  for(let i=0;i<machinesLength;i++){
    let data = await getReservationsByMachine(machines[i].id,startDate,endDate)
    response[machines[i].name] = data
  }
  return response
}

const getReservationsByMachine = async (machineId,startDate,endDate) =>{
  const reservations = await db.Reservation.findAll({ 
    where: { machineId: +machineId,
      state:ReservationState.ENDED,
      start_date:{
        [Op.lt]:endDate,
        [Op.gte]:startDate
      } 
    }});
  const groupArrays = groupAndReduceReservations(reservations)
  return groupArrays
}

const groupAndReduceReservations = (reservations)=>{
    const groups = reservations.reduce((groups,reservation)=>{
      const purpose = reservation.reservationPurpose
      if(!groups[purpose]){
      groups[purpose] = [];
      }
      groups[purpose].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000)
      return groups;
    },[])
    const groupArrays = Object.keys(groups).map((purpose) => {
      let amountOfMinutes = 0;
      groups[purpose].forEach(minutes=>{
          amountOfMinutes+=minutes
      })
      return {
          purpose,
          time: amountOfMinutes
      };
    });
    return groupArrays
}

module.exports = {
  getReservationsByMachine,getMachineReservationsByDepartmentId,groupAndReduceReservations
}