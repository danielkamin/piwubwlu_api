const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const { authorizeAdmin } =require('../Middlewares/rolesAuthorize')
const paginatedSortedResults = require('../Middlewares/pagination')
const express =require('express')
const db =require("../../database/models")
const upload =require('../Utils/multerConfig')
const uploadImage =require('../Middlewares/uploadImage')
const {
    createMachine,
    updateMachine,
    removeMachine,
    getAllMachine, getMachineById,getMachineList
  } =require('../Controllers/MachineController')
const {getMachineReservation} =require('../Controllers/ReservationController')
const machineRouter = express.Router();
machineRouter.post('/',verifyAccessToken,authorizeAdmin,createMachine);
machineRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateMachine);
machineRouter.delete('/:id',verifyAccessToken,authorizeAdmin,removeMachine);
machineRouter.get('/', verifyAccessToken, getAllMachine);
machineRouter.get('/list', paginatedSortedResults(db.Machine),getMachineList);
machineRouter.get('/:id',  getMachineById);
machineRouter.get('/rent/:id',verifyAccessToken,getMachineReservation);
machineRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Machine))
module.exports = machineRouter;