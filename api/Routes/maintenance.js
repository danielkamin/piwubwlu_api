
const {getErrorLogFile,getInfoLogFile} = require('../Controllers/Administrative/Maintenance')
const express =require('express')
const maintenanceRouter = express.Router();

maintenanceRouter.get('/logs/error',getErrorLogFile)
maintenanceRouter.get('/logs/info',getInfoLogFile)
module.exports = maintenanceRouter;