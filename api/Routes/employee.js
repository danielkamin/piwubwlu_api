const { verifyAccessToken } =require('../Middlewares/tokenVerify');
const express =require('express');
const {getEmployeeList,getAllEmployee,getEmployeeById,updateEmployee,displayEmployees} =require('../Controllers/EmployeeController')
const {authorizeAdmin} =require('../Middlewares/rolesAuthorize')
const employeeRouter = express.Router();
//employeeRouter.get('/',verifyAccessToken,getAllEmployee);
employeeRouter.get('/display',displayEmployees);
employeeRouter.get('/list',verifyAccessToken,getEmployeeList);
employeeRouter.get('/',getAllEmployee);
employeeRouter.get('/:id',getEmployeeById);
employeeRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateEmployee);
module.exports = employeeRouter;