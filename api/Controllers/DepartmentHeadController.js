const db = require('../../database/models')
const logger = require('../Config/loggerConfig')
const supervisorCheck = require('../Utils/supervisorCheck')
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
        //komentarz o poprawkach w mailu
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'suggestDeclineReservation'})
    }
}