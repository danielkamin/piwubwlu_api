const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const express = require('express')

const statsRouter = express.Router();

module.exports = statsRouter;