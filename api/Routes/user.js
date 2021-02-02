const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const express = require('express')
const {getProfileInfo,uploadProfilePicture,updateProfileInfo,changePassword,deleteUser} = require('../Controllers/UserController')
const upload = require('../Utils/multerConfig')

const userRouter = express.Router();
userRouter.get('/my_profile',verifyAccessToken,getProfileInfo);
userRouter.delete('/:id', verifyAccessToken, authorizeAdmin, deleteUser);
userRouter.post('/upload_picture',verifyAccessToken,upload.single('image'),uploadProfilePicture)
userRouter.post('/update_profile',verifyAccessToken,updateProfileInfo)
userRouter.post('/change_password',verifyAccessToken,changePassword)
module.exports = userRouter;