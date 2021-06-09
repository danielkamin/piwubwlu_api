const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const { authorizeRole } =require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const {
    getMachineServiceById,getMachineServices,createMachineService,
    updateMachineService,deleteMachineService,getMachineServicesByMachineId
  } =require('../Controllers/MachineServiceController')

const express = require('express')
const serviceRouter = express.Router();

serviceRouter.get('/machine/:id',getMachineServiceById)
serviceRouter.get('/:id',getMachineServiceById)
serviceRouter.get('/',getMachineServices)
serviceRouter.post('/',createMachineService)
serviceRouter.put('',updateMachineService)
serviceRouter.delete('/',deleteMachineService)

module.exports = serviceRouter