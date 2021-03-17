const express = require('express')
const {fetchAllNames,searchAllData} = require('../Controllers/UtilsController')
const utilsRouter = express.Router();

utilsRouter.get('/names',fetchAllNames)
utilsRouter.get('/search',searchAllData)
module.exports = utilsRouter;