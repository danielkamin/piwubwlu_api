const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const {authorizeAdmin} = require('../Middlewares/rolesAuthorize')
const {createWorkshopType,removeWorkshopType,updateWorkshopType,getAllWorkshopType,getWorkshopTypeById,getWorkshopTypeList} = require('../Controllers/WorkshopTypeController')
const workshopTypeRouter = express.Router();

workshopTypeRouter.get('/', verifyAccessToken, getAllWorkshopType);
workshopTypeRouter.get('/list', verifyAccessToken, getWorkshopTypeList);
workshopTypeRouter.post('/',verifyAccessToken,authorizeAdmin, createWorkshopType);
workshopTypeRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateWorkshopType);
workshopTypeRouter.delete('/:id',verifyAccessToken,authorizeAdmin,removeWorkshopType);
workshopTypeRouter.get('/:id', verifyAccessToken, getWorkshopTypeById);
module.exports = workshopTypeRouter;