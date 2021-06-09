const labRouter = require( './lab')
const machineRouter = require( './machine')
const workshopRouter = require( './workshop')
const departmentRouter = require( './department')
const employeeRouter = require( './employee')
const rentalRouter = require( './reservation')
const authRouter = require( './auth')
const userRouter = require( './user')
const utilsRouter = require( './utils')
const guestRouter = require( './guest')
const degreeRouter = require('./degree')
const CASRouter = require('./cas')
const statsRouter = require('./stats')
const workshopTypeRouter = require( './workshopType')
const maintenanceRouter = require('./maintenance')
const smtpRouter = require('./smtp')
const departmentHeadRouter = require('./departmentHead')
const machineServiceRouter = require('./machineservice')
module.exports = {
    labRouter,machineRouter,workshopRouter,
    departmentRouter,employeeRouter,rentalRouter,
    authRouter,userRouter,utilsRouter,guestRouter,degreeRouter,
    CASRouter,statsRouter,workshopRouter,workshopTypeRouter,
    maintenanceRouter,smtpRouter,departmentHeadRouter,
    machineServiceRouter
}