const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const {getPersonalStatistics,getYearlyStatistics} = require('../Controllers/StatisticsController')
const express = require('express')

const statsRouter = express.Router();

statsRouter.get('/yearly',verifyAccessToken,authorizeAdmin,getYearlyStatistics)
statsRouter.get('/personal/:id',verifyAccessToken,authorizeAdmin,getPersonalStatistics)

module.exports = statsRouter;