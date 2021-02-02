const express = require('express')
const AssetController = require('../Controllers/AssetController')
const assetRouter = express.Router();

assetRouter.get('/images',AssetController.getImagesPath)
assetRouter.post('/verify_captcha',AssetController.verifyCaptcha)

module.exports = assetRouter;