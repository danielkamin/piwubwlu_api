const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const paginatedSortedResults = require('../Middlewares/pagination')
const db = require("../../database/models")
const {authorizeAdmin} = require('../Middlewares/rolesAuthorize')
const upload = require('../Utils/multerConfig')
const {createWorkshop,updateWorkshop,removeWorkshop, getAllWorkshop, getWorkshopById, getWorkshopsList} = require('../Controllers/WorkshopController')
const uploadImage = require('../Middlewares/uploadImage')
const workshopRouter = express.Router();
workshopRouter.get('/list', paginatedSortedResults(db.Workshop),getWorkshopsList);
workshopRouter.get('/:id',  getWorkshopById);
workshopRouter.get('/', verifyAccessToken,  getAllWorkshop);
workshopRouter.post('/',verifyAccessToken,authorizeAdmin,createWorkshop);
workshopRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateWorkshop);
workshopRouter.delete('/:id',verifyAccessToken,authorizeAdmin,removeWorkshop);
workshopRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Workshop))
module.exports = workshopRouter;