const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const seachAndSortData = require('../Middlewares/searchAndSort')
const db = require("../../database/models")
const Op = db.Sequelize.Op;
const {authorizeAdmin} = require('../Middlewares/rolesAuthorize')
const upload = require('../Utils/multerConfig')
const {createWorkshop,updateWorkshop,removeWorkshop, getAllWorkshop, 
    getHelperNamesWorkshops,getWorkshopById, getWorkshopsList,getWorkshopReservations} = require('../Controllers/WorkshopController')
const {uploadImage,deleteImage} = require('../Middlewares/uploadImage')
const workshopRouter = express.Router();
workshopRouter.get('/names', getHelperNamesWorkshops);
workshopRouter.get('/reservations/:id', getWorkshopReservations);
workshopRouter.get('/list', seachAndSortData(db.Workshop,Op),getWorkshopsList);
workshopRouter.get('/:id',  getWorkshopById);
workshopRouter.get('/', verifyAccessToken,  getAllWorkshop);
workshopRouter.post('/',verifyAccessToken,authorizeAdmin,createWorkshop);
workshopRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateWorkshop);
workshopRouter.delete('/:id',verifyAccessToken,authorizeAdmin,removeWorkshop);
workshopRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Workshop))
workshopRouter.post('/delete_image',verifyAccessToken,deleteImage(db.Workshop))
module.exports = workshopRouter;