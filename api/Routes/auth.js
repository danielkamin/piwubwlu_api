const express =require('express')
const {
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  verifyAdminRefreshToken
} =require('../Middlewares/tokenVerify')
const {authorizeAdmin} =require('../Middlewares/rolesAuthorize')
const AuthController =require('../Controllers/Account/AuthController')
const EditAccountController =require('../Controllers/Account/EditAccountController')
const authRouter = express.Router();
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/admin/login', AuthController.adminLogin);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/admin/logout', verifyAccessToken, AuthController.adminLogout);
authRouter.post('/reset_password', EditAccountController.requestNewPasswordForm);
authRouter.get('/new_password/:token', verifyResetToken, EditAccountController.getNewPasswordForm);
authRouter.post('/new_password/:token',verifyResetToken, EditAccountController.postNewPasswordForm);
authRouter.post('/change_password',verifyAccessToken, EditAccountController.changePassword);
authRouter.post('/refresh_token', verifyRefreshToken);
//authRouter.post('/authorize_admin', verifyAccessToken, authorizeAdmin);
authRouter.post('/admin/refresh_token', verifyAdminRefreshToken);
authRouter.post('/change_email', verifyAccessToken, EditAccountController.changeEmailAddress);
authRouter.post('/delete_account',verifyAccessToken,EditAccountController.deleteAccount)
module.exports = authRouter;
