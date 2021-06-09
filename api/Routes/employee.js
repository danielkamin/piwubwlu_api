const { verifyAccessToken } =require('../Middlewares/tokenVerify');
const express =require('express');
const {getEmployeeList,getAllEmployee,getEmployeeById,
    updateEmployee,displayEmployees,getAllSupervisedResources} =require('../Controllers/EmployeeController')
const { authorizeRole } =require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const employeeRouter = express.Router();
//employeeRouter.get('/',verifyAccessToken,getAllEmployee);
employeeRouter.get('/resources',verifyAccessToken,getAllSupervisedResources)
employeeRouter.get('/display',displayEmployees);
employeeRouter.get('/list',verifyAccessToken,getEmployeeList);
employeeRouter.get('/',getAllEmployee);
employeeRouter.get('/:id',getEmployeeById);
employeeRouter.put('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),updateEmployee);
module.exports = employeeRouter;