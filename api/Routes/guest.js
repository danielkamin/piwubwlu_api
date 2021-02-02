const express =require('express')
const { authorizeAdmin } =require('../Middlewares/rolesAuthorize')
const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const {getGuestById,getGuestList,updateGuest} =require('../Controllers/GuestController')
const guestRouter = express.Router();

guestRouter.get('/list',verifyAccessToken,authorizeAdmin,getGuestList);
guestRouter.put('/:id',verifyAccessToken,authorizeAdmin,updateGuest)
guestRouter.get('/:id',verifyAccessToken,authorizeAdmin,getGuestById)

module.exports = guestRouter;