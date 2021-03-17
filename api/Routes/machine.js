const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const { authorizeAdmin } =require('../Middlewares/rolesAuthorize')
const seachAndSortData = require('../Middlewares/searchAndSort')
const express = require('express')
const db = require("../../database/models")
const Op = db.Sequelize.Op;
const upload = require('../Utils/multerConfig')
const {uploadImage,deleteImage} = require('../Middlewares/uploadImage')
const {
    createMachine,
    updateMachine,
    removeMachine,
    getAllMachine, getMachineById,getMachineList,getMachineSupervisors
  } =require('../Controllers/MachineController')
const {getMachineReservation} =require('../Controllers/ReservationController')
const machineRouter = express.Router();
machineRouter.post('/',verifyAccessToken,authorizeAdmin,createMachine);
machineRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateMachine);
machineRouter.delete('/:id',verifyAccessToken,authorizeAdmin,removeMachine);
machineRouter.get('/', verifyAccessToken, getAllMachine);
machineRouter.get('/list', seachAndSortData(db.Machine,Op),getMachineList);
machineRouter.get('/:id',  getMachineById);
machineRouter.get('/supervisors/:id',  getMachineSupervisors);
machineRouter.get('/rent/:id',verifyAccessToken,getMachineReservation);
machineRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Machine))
machineRouter.post('/delete_image',verifyAccessToken,deleteImage(db.Machine))
module.exports = machineRouter;