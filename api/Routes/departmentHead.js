const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const {authorizeRole} = require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const {setWorkshopSupervisors,acceptReservation,declineReservation,sendForCorrections,getAllAssignedReservations} = require('../Controllers/DepartmentHeadController')
const departmentHeadRouter = express.Router();

departmentHeadRouter.get('/', verifyAccessToken,verifyAccessToken,authorizeRole(UserRoles.DEPARTMENTHEAD), getAllAssignedReservations);
departmentHeadRouter.post('/correct/:id',verifyAccessToken,authorizeRole(UserRoles.DEPARTMENTHEAD),sendForCorrections)
departmentHeadRouter.post('/accept/:id',verifyAccessToken,authorizeRole(UserRoles.DEPARTMENTHEAD),acceptReservation)
departmentHeadRouter.post('/decline/:id',verifyAccessToken,authorizeRole(UserRoles.DEPARTMENTHEAD),declineReservation)
departmentHeadRouter.post('/workshop_supervisors/:id',verifyAccessToken,authorizeRole(UserRoles.DEPARTMENTHEAD),setWorkshopSupervisors)

module.exports = departmentHeadRouter;