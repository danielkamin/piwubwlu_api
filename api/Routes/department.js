const { verifyAccessToken } =require( '../Middlewares/tokenVerify')
const express = require('express');
const {updateDepartment,createDepartment,removeDepartment,getALLDepartment,getDepartmentList,getDepartmentById} =require('../Controllers/DepartmentController')
const departmentRouter = express.Router();

departmentRouter.get('/list',getDepartmentList);
departmentRouter.get('/:id', verifyAccessToken, getDepartmentById);
departmentRouter.get('/', verifyAccessToken,getALLDepartment );
departmentRouter.post('/', verifyAccessToken,createDepartment );
departmentRouter.put('/:id', verifyAccessToken,updateDepartment );
departmentRouter.delete('/:id', verifyAccessToken,removeDepartment );
module.exports = departmentRouter;