const logger = require('../../Config/loggerConfig')
const db = require('../../../database/models')
const {SMTPSettingsValidation} = require('../../Validation/resource')

exports.setSMTPSettings = async (req,res)=>{
    try{
        const values = req.body
        const {error} = SMTPSettingsValidation(values)
        if (error) return res.status(400).send(error.details[0].message);
        const oldSMTPSettings = await db.SMTP_Settings.findAll({limit:1})
        await db.SMTP_Settings.update({
            user: values.user,
            pass: values.password,
            host: values.host,
            requireTLS: values.requireTLS?values.requireTLS:false ,
            sequre: values.requireTLS?values.requireTLS:false,
            port: values.port?values.port:465
        },{ where: { id: oldSMTPSettings[0].id } })
        res.send({ok:true});
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'setSMTPSettings'})
    }
}

exports.getSMTPSettings = async (req,res)=>{
    try{
        const SMTPSettings = await db.SMTP_Settings.findAll({limit:1})
        res.send(SMTPSettings[0]);
    }catch(err){
        res.send(err);
        logger.error({message: err, method: 'getSMTPSettings'})
    }
}