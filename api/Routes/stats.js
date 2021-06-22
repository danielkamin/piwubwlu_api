const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const {getYearlyStatistics,getMonthlyMachineStatistics,getPersonalStatisticsByMonth,getPersonalStatisticsByYear} = require('../Controllers/StatisticsController')
const express = require('express')

const statsRouter = express.Router();


module.exports = statsRouter;