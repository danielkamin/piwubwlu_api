const express =require('express')
const { authorizeRole } =require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const { verifyAccessToken } =require('../Middlewares/tokenVerify')
const {getGuestById,getGuestList,updateGuest} =require('../Controllers/GuestController')
const guestRouter = express.Router();

guestRouter.get('/list',verifyAccessToken,authorizeRole(UserRoles.ADMIN),getGuestList);
guestRouter.put('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),updateGuest)
guestRouter.get('/:id',verifyAccessToken,authorizeRole(UserRoles.ADMIN),getGuestById)

module.exports = guestRouter;