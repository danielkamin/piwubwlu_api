const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const express = require('express')
const {deleteImage} = require('../Middlewares/imageHandler')
const db = require("../../database/models")
const {getProfileInfo,uploadProfilePicture,updateProfileInfo,changePassword,deleteUser,getUserDescription} = require('../Controllers/UserController')
const upload = require('../Utils/multerConfig')

const userRouter = express.Router();
userRouter.get('/my_profile',verifyAccessToken,getProfileInfo);
userRouter.delete('/:id', verifyAccessToken, authorizeAdmin, deleteUser);
userRouter.post('/upload_picture',verifyAccessToken,upload.single('image'),uploadProfilePicture)
userRouter.post('/delete_picture',verifyAccessToken,deleteImage(db.User))
userRouter.post('/update_profile',verifyAccessToken,updateProfileInfo)
userRouter.post('/change_password',verifyAccessToken,changePassword)
userRouter.post('/description',verifyAccessToken,getUserDescription)
module.exports = userRouter;