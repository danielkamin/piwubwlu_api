const {roles} =require('./constants')
/**
 * Checks if user with given employeeId is supervising any laboratories or workshops.
 * If addSuperRole is true - give that role to the user, else remove that role
 * @param {number} employeeId 
 * @param {object} db 
 * @param {boolean} addSuperRole
 */
const supervisorCheck = async (employeeId,db,addSuperRole)=>{
    const emp = await db.Employee.findByPk(employeeId)
    const superRole = await db.Role.findOne({where:{role_name:roles[1]}})
    const superUserRole = await db.UserRole.findOne({where:{roleId:superRole.id,userId:emp.userId}})
    if(addSuperRole){
        if(!superUserRole) await db.UserRole.create({roleId:superRole.id,userId:emp.userId})
    }else{
        const labs = await db.Lab.findAll({where:{employeeId:employeeId}})
        const workshops = await db.WorkshopSupervisor.findAll({where:{EmployeeId:employeeId}})
        if(labs.length===0 && workshops.length===0){
            console.log(emp)
            await db.UserRole.destroy({where:{roleId:superRole.id,userId:emp.userId}})
        }
            
    }    

}
module.exports = supervisorCheck