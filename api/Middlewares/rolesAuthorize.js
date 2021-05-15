
const {roles} = require('../Utils/constants');
const db = require('../../database/models')

exports.authorizeRole= function(role){
  return (req, res, next)=>{
    try {
      if (!req.user.role.includes(role))
        return res.status(403).send('Unauthorized');
      next();
    } catch (err) {
      res.send(err);
    }
  }
}

exports.authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.user.role.includes(roles[0]))
      return res.status(403).send('Unauthorized');
    next();
  } catch (err) {
    res.send(err);
  }
};
exports.authorizeSupervisor = async (req, res, next) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.send('No user');
  try {
    if (!req.user.role.includes(roles[1]))
      return res.status(403).send('Unauthorized');
    next();
  } catch (err) {
    res.send(err);
  }
};
