const express = require('express')
const AssetController = require('../Controllers/UtilsController')
const utilsRouter = express.Router();

utilsRouter.get('/images',AssetController.getImagesPath)
utilsRouter.get('/search',AssetController.searchAllData)
utilsRouter.post('/verify_captcha',AssetController.verifyCaptcha)

module.exports = utilsRouter;