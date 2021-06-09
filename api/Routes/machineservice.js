const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const { authorizeRole } =require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const express = require('express')
const {
    createMachineService,getMachineServices
  } =require('../Controllers/MachineServiceController')
const machineServiceRouter = express.Router();

machineServiceRouter.post('/:id',verifyAccessToken,authorizeRole(UserRoles.SUPERVISOR),createMachineService)
machineServiceRouter.get('/:id',verifyAccessToken,getMachineServices)
module.exports = machineServiceRouter;