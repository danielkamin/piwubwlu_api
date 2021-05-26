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
        const workshops = await db.WorkshopSupervisor.findAll({where:{EmployeeId:employeeId}})
        if(workshops.length===0){
            await db.UserRole.destroy({where:{roleId:superRole.id,userId:emp.userId}})
        }
            
    }    

}
module.exports = supervisorCheck