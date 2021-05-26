const db = require('../../database/models')
const { LabValidation } = require('../Validation/resource')
const supervisorCheck = require('../Utils/supervisorCheck')
const {emptyStringToNull} = require('../Utils/helpers')
const logger = require('../Config/loggerConfig')
exports.createLab = async (req, res) => {
  const { error } = LabValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let empId = req.body.employeeId!==''?req.body.employeeId:null
  try {
    const lab = await db.Lab.create({
      name: req.body.name,
      english_name: req.body.english_name,
      additionalInfo:req.body.additionalInfo,
    });
    res.send({ id: lab.id });
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'createLab'})
  }
};

exports.updateLab = async (req, res) => {
  const { error } = LabValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    additionalInfo:req.body.additionalInfo
  });
  if (error) return res.status(400).send(error.details[0].message);
  const lab = await db.Lab.findByPk(req.params.id);
  try {
    await lab.update({
      name: req.body.name,
      english_name: req.body.english_name,
      additionalInfo:req.body.additionalInfo
    });
    res.send({ id: req.params.id  });
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'updateLab'})
  }
};

exports.removeLab = async (req, res) => {
  const lab = await db.Lab.findByPk(req.params.id);
  if (!lab) return res.status(400).send('Problem occurred while removing this Lab');
  try {
    await lab.destroy();
    res.send({ok:true});
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'removeLab'})
  }
};

exports.getAllLab = async (req, res) => {
  try {
    const labs = await db.Lab.findAll();
    res.send(labs);
  } catch (err) {
    res.send(err);
    logger.error({message: err, method: 'getAllLab'})
  }
};

exports.getLabById = async (req, res) => {
  try {
    const lab = await db.Lab.findByPk(req.params.id,{include:[{model:db.Workshop},{model:db.Employee,include:db.User}]});
    res.send(lab);
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'getLabById'})
  }
};

exports.getLabList = async (req, res) => {
  try {
    const labList = await db.Lab.findAll({ attributes: ['id', 'name','employeeId','english_name','imagePath'] });
    res.send(labList);
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'getLabList'})
  }
}