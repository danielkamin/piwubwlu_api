const db = require("../../database/models")
const { WorkshopTypeValidation } = require('../Validation/resource')
const logger = require('../Config/loggerConfig')
exports.createWorkshopType = async (req, res) => {
  const { error } = WorkshopTypeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await db.WorkshopType.create({
      name: req.body.name,
      english_name: req.body.english_name,
      symbol: req.body.symbol
    });
    res.send({ ok: true });
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'createWorkshopType'})
  }
};
exports.updateWorkshopType = async (req, res) => {
  const workshopType = db.WorkshopType.findByPk(req.params.id);
  if (!workshopType) return res.status(400).send('Problem occurred while finding that type of workshop with that ID');
  
  const { error } = WorkshopTypeValidation({
    name: req.body.name,
    english_name: req.body.english_name,
    symbol:req.body.symbol
  });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    await db.WorkshopType.update({ name: req.body.name, english_name: req.body.english_name,symbol:req.body.symbol }, { where: { id: req.params.id } });
    res.send({ok:true});
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'updateWorkshopType'})
  }
};
exports.removeWorkshopType = async (req, res) => {
  // const workshopType = await db.WorkshopType.findByPk(req.params.id);
  // if (!workshopType) return res.status(400).send('Problem occurred with finding that type of workshop');
  try {
    await db.WorkshopType.destroy({
      where: { id: req.params.id }
    });
    res.send({ok:true});
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'removeWorkshopType'})
  }
};
exports.getAllWorkshopType = async (req, res) => {
  try {
    const workshopTypes = await db.WorkshopType.findAll();
    res.send(workshopTypes);
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'getAllWorkshopType'})
  }
};

exports.getWorkshopTypeById = async (req, res) => {
  try {
    const workshopTypeName = await db.WorkshopType.findByPk(req.params.id);
    res.send(workshopTypeName);
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'getWorkshopTypeById'})
  }
};

exports.getWorkshopTypeList = async (req, res) => {
  try {
    const workshopTypeList = await db.WorkshopType.findAll({
      attributes: ['id', 'symbol']
    });
    res.send(workshopTypeList);
  } catch (err) {
    res.send(err.sql);
    logger.error({message: err, method: 'getWorkshopTypeList'})
  }
};

