const db = require('../../database/models')
const {DegreeValidation} = require('../Validation/resource')
exports.createDegree = async (req,res)=>{
    const { error } = DegreeValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try{
        await db.Degree.create({
            name:req.body.name,
        });
        res.send({ ok: true });
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.updateDegree = async (req,res)=>{
    const { error } = DegreeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
    try{
        await db.Degree.update(
            {
              name: req.body.name,
            },
            { where: { id: req.params.id } }
          );
          res.send({ ok: true });
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.removeDegree = async (req,res)=>{
    try{    
        await db.Degree.destroy({ where: { id: req.params.id } });
        res.send({ok:true});
    }catch(err)
    {
        res.send(err.original.detail);
    }
}
exports.getAllDegree = async (req,res)=>{
    try{
        const degrees = await db.Degree.findAll();
        res.send(degrees)
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.getDegreeById = async (req,res)=>{
    try{
        const degree = await db.Degree.findByPk(req.params.id);
        res.send(degree)
    }catch(err)
    {
        res.send(err.sql);
    }
}
exports.getDegreesList = async (req,res)=>{
    try{
        const degrees = await db.Degree.findAll({attributes:['id','name']});
        res.send(degrees)
    }catch(err)
    {
        res.send(err.sql);
    }
}