const db = require('../../database/models');
const {sendMessage} = require('./config')


exports.sendSupervisorEmails = async (machineId,db,title,message)=>{
    let supervisors = await db.Machine.findByPk(machineId,{include:
      {model:db.Workshop,include:
        {model:db.Employee,required:true,include:db.User}}})
    const workshopSupervisorsOrder = await db.WorkshopSupervisor.findAll({where:{WorkshopId:supervisors.Workshop.id}})

    /* First on the list */ 
    let firstSupervisorIndex = supervisors.Workshop.Employees.map((item)=>{
      return item.id
    }).indexOf(workshopSupervisorsOrder[0].EmployeeId)

    try{
      const workshopSupervisorEmail = supervisors.Workshop.Employees[firstSupervisorIndex].User.email
      workshopSupervisorEmail !==null && sendMessage(workshopSupervisorEmail,title,message)
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
  /**
   * 
   * @param {object} reservation Object of currently processed reservation
   */
exports.sendToDepartmentHeadMessage = async (reservation)=>{
    const departmentHeadMessage = await db.Reservation.findOne({where:{id:reservation.id},
        include:{model:db.Machine,
        include:{model:db.Workshop,
            include:{model:db.Lab,
            include:{model:db.Department}}}}});

    const empId = departmentHeadMessage.Machine.Workshop.Lab.Department.employeeId
    const user= await db.Employee.findOne({where:{id:empId},include:db.User})

    sendMessage(user.User.email,'Powiadomienie o nowej rezerwacji',
        `Jest to automatyczna wiadomość wysłana przez Wydziałowe Centrum Rezerwacji Aparatury Badawczej na Wydziale Mechanicznym. \n\r 
        W celu wyrażenia swojej zgody na rezerwację aparatury: ${departmentHeadMessage.Machine.name}
        odbywającej się 
        od: ${new Date(departmentHeadMessage.start_date).toLocaleString('pl-PL')}
        do: ${new Date(departmentHeadMessage.end_date).toLocaleString('pl-PL')},
        uprasza się przesłać tę wiadomość do jednej z wybranych osób nadzorujących tę aparaturę.`)
}

exports.sendMonthlyStatistics = ()=>{
  
}