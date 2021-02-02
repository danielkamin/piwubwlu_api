const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const LabController =require('../Controllers/LabController')
const express =require('express')
const {authorizeAdmin} =require('../Middlewares/rolesAuthorize')
const labRouter = express.Router();
labRouter.post('/',verifyAccessToken,authorizeAdmin,LabController.createLab);
labRouter.get('/list',LabController.getLabList);
labRouter.put('/:id',verifyAccessToken,authorizeAdmin,LabController.updateLab);
labRouter.delete('/:id',verifyAccessToken,authorizeAdmin,LabController.removeLab);
labRouter.get('/', verifyAccessToken,LabController.getAllLab);
labRouter.get('/:id', LabController.getLabById);
module.exports = labRouter;