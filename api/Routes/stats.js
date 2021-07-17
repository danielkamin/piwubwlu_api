const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const { authorizeAdmin } = require('../Middlewares/rolesAuthorize')
const {getMonthlyMachineStatistics,
    getPersonalStatisticsByMonth,
    getDepartmentStatistics,
    exportDepartmentStatisticsPDF,
    sendDepartmentStatisticsToEmail} 
    = require('../Controllers/StatisticsController')
const express = require('express')

const statsRouter = express.Router();

statsRouter.get('/machine/month',getMonthlyMachineStatistics)
statsRouter.get('/department/month',getDepartmentStatistics)
statsRouter.get('/employee/month',getPersonalStatisticsByMonth)
statsRouter.get('/pdf/department',exportDepartmentStatisticsPDF)
statsRouter.get('/pdf_email/departments',sendDepartmentStatisticsToEmail)
module.exports = statsRouter;