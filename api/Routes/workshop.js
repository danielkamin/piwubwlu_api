const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const seachAndSortData = require('../Middlewares/searchAndSort')
const db = require("../../database/models")
const Op = db.Sequelize.Op;
const {UserRoles} = require('../Utils/constants')

const {authorizeRole} = require('../Middlewares/rolesAuthorize')
const upload = require('../Utils/multerConfig')
const {createWorkshop,updateWorkshop,removeWorkshop, getAllWorkshop, 
    getHelperNamesWorkshops,getWorkshopById, getWorkshopsList,getWorkshopEvents} = require('../Controllers/WorkshopController')
const {uploadImage,deleteImage} = require('../Middlewares/imageHandler')


const workshopRouter = express.Router();
workshopRouter.get('/names', getHelperNamesWorkshops);
workshopRouter.get('/events/:id', getWorkshopEvents);
workshopRouter.get('/list', seachAndSortData(db.Workshop,Op),getWorkshopsList);
workshopRouter.get('/:id',  getWorkshopById);
workshopRouter.get('/', verifyAccessToken,  getAllWorkshop);
workshopRouter.post('/',verifyAccessToken,authorizeRole(UserRoles.ADMIN),createWorkshop);
workshopRouter.put('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),updateWorkshop);
workshopRouter.delete('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),removeWorkshop);
workshopRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Workshop))
workshopRouter.post('/delete_image',verifyAccessToken,deleteImage(db.Workshop))
module.exports = workshopRouter;