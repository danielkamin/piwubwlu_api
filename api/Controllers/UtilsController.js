const db = require('../../database/models')
const Op = db.Sequelize.Op
const fetch = require('node-fetch')
const CASUrl = 'https://idm.uci.pb.edu.pl/cas'
const {WEB_URL_NOPORT,WEB_URL} = require('../Utils/constants')
exports.getImagesPath = async (req,res)=>{
    res.send({logoPath:WEB_URL_NOPORT+':5000/uploads/LogoPB.png',bgPath:WEB_URL_NOPORT+':5000/uploads/background.jpg'})
}
exports.verifyCaptcha = async(req,res)=>{
    const user = await db.User.findByPk(req.body.userId,{attributes:['email'],include:{model:db.Employee,attributes:['telephone']}})
    if (!req.body.captcha)
      return res.send({ ok: false, msg: 'Please select captcha' });
  
    const secret = process.env.CAPTCHA_SECRET;
    try{
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`
      const body = await fetch(verifyUrl).then(res => res.json());
      if (body.success !== undefined && !body.success)
        return res.send({ ok: false, msg: 'Failed captcha verification' });
    
      return res.send({ ok: true, msg: 'Captcha passed',email:user.email,telephone:user.telephone });
    }catch(err){
      res.send(err)
    }
  }
exports.searchAllData = async (req,res)=>{
  const name = (req.query.q===undefined)?'':(req.query.q)
  console.log(name)
  try{
    const employees = await db.User.findAll({
      attributes: ['id', 'firstName','lastName'],
      where:{
        [Op.or]:[
          {firstName:{[Op.iLike]:'%'+name+'%'}},
        {lastName:{[Op.iLike]:'%'+name+'%'}}]},
      include:{model:db.Employee,required:true}
  })
    const machines = await db.Machine.findAll({
      attributes: ['id', 'name','english_name'],
      where:{
        [Op.or]:[
          {name:{[Op.iLike]:'%'+name+'%'}},
          {english_name:{[Op.iLike]:'%'+name+'%'}}
        ]},
    })
    const workshops = await db.Workshop.findAll({
      attributes: ['id', 'name','english_name'],
      where:{
        [Op.or]:[
          {name:{[Op.iLike]:'%'+name+'%'}},
          {english_name:{[Op.iLike]:'%'+name+'%'}}
        ]},
    })
    const labs = await db.Lab.findAll({
      attributes: ['id', 'name','english_name'],
      where:{
      [Op.or]:[
        {name:{[Op.iLike]:'%'+name+'%'}},
      {english_name:{[Op.iLike]:'%'+name+'%'}}
    ]},
    })
    let resources = [];
    resources.push(employees.map(emp=>{
      return {id:emp.id,name:emp.firstName,secondName:emp.lastName}
    }))
    resources.push(machines.map(item=>{
      return {id:item.id,name:item.name,secondName:item.english_name}
    }))
    resources.push(workshops.map(item=>{
      return {id:item.id,name:item.name,secondName:item.english_name}
    }))
    resources.push(labs.map(item=>{
      return {id:item.id,name:item.name,secondName:item.english_name}
    }))
    res.send(resources)
  }catch(err){
    res.send(err)
  }
}

exports.CASLogin = async (req,res)=>{
  
}
exports.CASVerify= async (req,res)=>{

}

exports.fetchAllNames = async (req,res)=>{
  try{
    const names = await db.Lab.findAll({attributes:['id','name'],include:
      {model:db.Workshop,include:
        {model:db.Machine,required:true,attributes:['id','name']},required:true,attributes:['id','name']}})
    res.send(names);
  }catch(err){
    res.send(err)
  }
}