const logger = require('../../Config/loggerConfig')
const path = require('path')

exports.getErrorLogFile = async (req,res)=>{
    try{
        let file = __basedir+'/logs/error-logs.log';
        if(!file) res.send('No error log file found')
        res.download(file);
    }catch(err){
        logger.error(new Error('Problem while downloading error-logs.log file'));
    }
}

exports.getInfoLogFile = async (req,res)=>{
    try{
        let file = __basedir+'/logs/info-logs.log';
        if(!file) res.send('No info log file found')
        res.download(file);
    }catch(err){
        logger.error(new Error('Problem while downloading info-log.log file'));
    }
}