const db = require('../../database/models')
const { LabValidation } = require('../Validation/resource')
const supervisorCheck = require('../Utils/supervisorCheck')
exports.createLab = async (req, res) => {
  const { error } = LabValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let empId = req.body.employeeId!==''?req.body.employeeId:null
  try {
    const lab = await db.Lab.create({
      name: req.body.name,
      english_name: req.body.english_name,
      employeeId:empId
    });
    if(empId!==null)res.on('finish',function(){supervisorCheck(req.body.employeeId,db,true)})
    res.send({ ok: true });
  } catch (err) {
    res.send(err);
  }
};
exports.updateLab = async (req, res) => {

  const { error } = LabValidation({
    name: req.body.name,
    english_name: req.body.english_name
  });
  if (error) return res.status(400).send(error.details[0].message);

  let empId = req.body.employeeId!==''?req.body.employeeId:null
  try {
    await db.Lab.update({
      name: req.body.name,
      english_name: req.body.english_name,
      employeeId:empId
    },{ where: { id: req.params.id } }
    );
    if(empId!==null)res.on('finish',function(){supervisorCheck(req.body.employeeId,db,true)})
    res.send({ ok: true });
  } catch (err) {
    res.send(err.sql);
  }
};
exports.removeLab = async (req, res) => {
  const lab = await db.Lab.findByPk(req.params.id);
  if (!lab) return res.status(400).send('Problem occurred while removing this Lab');
  try {
    await db.Lab.destroy({ where: { id: req.params.id } });
    if(lab.employeeId!==null)res.on('finish',function(){supervisorCheck(lab.employeeId,db,false)})
    res.send({ok:true});
  } catch (err) {
    res.send(err);
  }
};
exports.getAllLab = async (req, res) => {
  try {
    const labs = await db.Lab.findAll();
    res.send(labs);
  } catch (err) {
    res.send(err);
  }
};
exports.getLabById = async (req, res) => {
  try {
    const lab = await db.Lab.findByPk(req.params.id,{include:[{model:db.Workshop},{model:db.Employee,include:db.User}]});
    res.send(lab);
  } catch (err) {
    res.send(err.sql);
  }
};
exports.getLabList = async (req, res) => {
  try {
    const labList = await db.Lab.findAll({ attributes: ['id', 'name','employeeId','english_name'] });
    res.send(labList);
  } catch (err) {
    res.send(err.sql);
  }
};