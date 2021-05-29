const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const express = require('express')
const {authorizeRole} = require('../Middlewares/rolesAuthorize')
const {UserRoles} = require('../Utils/constants')
const {setSMTPSettings,getSMTPSettings} = require('../Controllers/Administrative/SMTP')
const smtpRouter = express.Router();

smtpRouter.put('/', verifyAccessToken, authorizeRole(UserRoles.ADMIN),setSMTPSettings);
smtpRouter.get('/', verifyAccessToken, authorizeRole(UserRoles.ADMIN),getSMTPSettings);
module.exports = smtpRouter;