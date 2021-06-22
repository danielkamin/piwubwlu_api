const db = require('../../database/models')
const logger = require('../Config/loggerConfig')
const supervisorCheck = require('../Utils/supervisorCheck')
const {ReservationState} = require('../Utils/constants')
const {sendMessage} = require('../EmailService/config')

exports.setWorkshopSupervisors = async (req,res)=>{
    try{
        const id = req.params.id
        const oldWorkshopSupervisors = await db.WorkshopSupervisor.findAll({where:{WorkshopId:id}});
        await db.WorkshopSupervisor.destroy({where:{WorkshopId:id}})  
        oldWorkshopSupervisors.forEach(oldWorkshopSupervisor=>{
        supervisorCheck(oldWorkshopSupervisor.EmployeeId,db,false)
        })

        let supervisorEmployees = req.body.employees;
        res.on('finish',function () {
            supervisorEmployees.forEach((emp)=>{
                db.WorkshopSupervisor.create({
                    EmployeeId: emp.employeeId,
                    WorkshopId: id
                });
                supervisorCheck(emp.employeeId,db,true)
            })
        })
        res.send({ok:true})
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'setWorkshopSupervisors'})
    }
}

exports.acceptReservation = async (req,res)=>{
    try{
        
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'suggestAcceptReservation'})
    }
}

exports.declineReservation = async (req,res)=>{
    try{

    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'suggestDeclineReservation'})
    }
}

exports.sendForCorrections = async (req,res)=>{
    try{
        const reservation = await db.Reservation.findByPk(req.params.id,{include:db.Machine})
        reservation.update({
        state:ReservationState.PENDING
        })
        const employee = await db.Employee.findbyPk(reservation.employeeId,
            {include:db.User})
        sendMessage(employee.User.email,'Korekty do rezerwacji',
        `W celu akceptacji rezerwacji przez kierownika Katedry, rezerwacja na maszynę 
        ${reservation.Machine.name}, rozpoczynająca się: ${new Date(data.start_date).toLocaleString('pl-PL')}
        i kończącą się: ${new Date(data.end_date).toLocaleString('pl-PL')} musi zawierać następujące poprawki:`,req.body.comment)
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'suggestDeclineReservation'})
    }
}

exports.getAllAssignedReservations = async (req,res)=>{
    try{
        const departmentHeadEmployee = await db.Employee.findOne({where:{userId:req.user.id},include:{model:db.DepartmentHead}})
        if(departmentHeadEmployee.DepartmentHead!==null){
            const reservations  = await db.Reservation.findAll({where:{
                state:ReservationState.EVALUATION   
            },attributes:['id','state','start_date','end_date',],include:
            {model:db.Machine,attributes:['id','name','english_name'],required:true,include:
            {model:db.Workshop,attributes:['id','name','english_name'],required:true,include:
            {model:db.Lab,attributes:['id','name','english_name'],required:true,include:
            {model:db.Department, where:{id:departmentHeadEmployee.DepartmentHead.departmentId}}}}}})
            return res.send(reservations)
        }
        res.send([])
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'suggestDeclineReservation'})
    }
}