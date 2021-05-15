const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const LabController =require('../Controllers/LabController')
const express =require('express')
const upload = require('../Utils/multerConfig')
const {uploadImage,deleteImage} = require('../Middlewares/imageHandler')
const db = require("../../database/models")
const {authorizeAdmin} =require('../Middlewares/rolesAuthorize')
const labRouter = express.Router();
labRouter.post('/',verifyAccessToken,authorizeAdmin,LabController.createLab);
labRouter.get('/list',LabController.getLabList);
labRouter.put('/:id',verifyAccessToken,authorizeAdmin,LabController.updateLab);
labRouter.delete('/:id',verifyAccessToken,authorizeAdmin,LabController.removeLab);
labRouter.get('/', verifyAccessToken,LabController.getAllLab);
labRouter.get('/:id', LabController.getLabById);
labRouter.post('/upload_image',verifyAccessToken,upload.single('image'),uploadImage(db.Lab))
labRouter.post('/delete_image',verifyAccessToken,deleteImage(db.Lab))
module.exports = labRouter;