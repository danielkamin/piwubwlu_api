const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const {getYearlyStatistics,getMonthlyMachineStatistics,getPersonalStatisticsByMonth,
    getPersonalStatisticsByYear,getDepartmentStatistics} 
    = require('../Controllers/StatisticsController')
const express = require('express')

const statsRouter = express.Router();

statsRouter.get('/machine/month',getMonthlyMachineStatistics)
statsRouter.get('/department/month',getDepartmentStatistics)
statsRouter.get('/employee/month',getPersonalStatisticsByMonth)
module.exports = statsRouter;