const bcrypt = require('bcrypt')
const { newPasswordValidation} = require('../Validation/auth')
/**
 * Function takes two parameteres, Http Request and Http Result. 
 * Validates password and hashes it. If error return Result with 400 code and details of error
 * @param {object} req 
 * @param {object} res 
 * @return Returns hashed Password
 */
exports = validatePassword = async (req,res)=>{
    const {error} = newPasswordValidation({password:req.body.password,repeatPassword:req.body.repeatPassword})
    if(error) return res.status(400).send(error.details[0].message)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    return hashedPassword;
 }
 
exports.emptyStringToNull =(data)=>{
    return data !=='' ? data : null
}