const { verifyAccessToken } =require( '../Middlewares/tokenVerify')
const express = require('express');
const {createDegree,updateDegree,removeDegree,getAllDegree,getDegreeById,getDegreesList} = require('../Controllers/DegreeController')
const degreeRouter = express.Router();

degreeRouter.get('/list',getDegreesList);
degreeRouter.get('/:id', verifyAccessToken, getDegreeById);
degreeRouter.get('/', verifyAccessToken,getAllDegree );
degreeRouter.post('/', verifyAccessToken,createDegree );
degreeRouter.put('/:id', verifyAccessToken,updateDegree );
degreeRouter.delete('/:id', verifyAccessToken,removeDegree );
module.exports = degreeRouter;