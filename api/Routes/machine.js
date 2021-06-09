const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const { authorizeRole } =require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const seachAndSortData = require('../Middlewares/searchAndSort')
const express = require('express')
const db = require("../../database/models")
const Op = db.Sequelize.Op;
const upload = require('../Utils/multerConfig')
const {uploadImage,deleteImage} = require('../Middlewares/imageHandler')
const {
    createMachine, updateMachine,removeMachine,getMachineServices,
    getAllMachine, getMachineById,getMachineList,
    getMachineSupervisors,getSoftwareList
  } =require('../Controllers/MachineController')
const {getMachineReservation} =require('../Controllers/ReservationController')
const machineRouter = express.Router();

machineRouter.post('/',verifyAccessToken,authorizeRole(UserRoles.ADMIN),createMachine);
machineRouter.put('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),updateMachine);
machineRouter.delete('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),removeMachine);
machineRouter.get('/', verifyAccessToken, getAllMachine);
machineRouter.get('/machine/list',getMachineList);
machineRouter.get('/software/list',getSoftwareList);
machineRouter.get('/type', getSoftwareList);
machineRouter.get('/:id',  getMachineById);
machineRouter.get('/supervisors/:id',  getMachineSupervisors);
machineRouter.get('/rent/:id',verifyAccessToken,getMachineReservation);
machineRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Machine))
machineRouter.post('/delete_image',verifyAccessToken,deleteImage(db.Machine))

module.exports = machineRouter;