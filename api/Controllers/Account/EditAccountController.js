const bcrypt = require( 'bcrypt');
const db = require( '../../../database/models')
const {WEB_URL} = require( '../../Utils/constants')
const { createResetToken } = require( '../../Utils/tokenCreate')
const { emailValidation, newPasswordValidation } = require( '../../Validation/auth')
const {sendMessage} = require( '../../Utils/emailConfig')

exports.requestNewPasswordForm = async (req, res) => {
  const { error } = emailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await db.User.findOne({ where: { email: req.body.email } });
  if (!user)
    return res
      .status(400)
      .send('Nie znaleziono użytkownika z podanym adresem e-mail');

  try {
    const resetToken = await db.ResetToken.create({
      userId: user.id,
      reset_token: createResetToken(user),
    });  
      const url =
        WEB_URL +
        '/nowe_haslo/' +
        resetToken.reset_token +
        '\n';
    
    sendMessage(req.body.email,
      'Reset Hasła',
     ` Kliknij w poniższy link w celu stworzenia nowego hasła: \n ${url}`)
    res.send('Wysłano wiadomość na podany adres e-mail');
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getNewPasswordForm = async (req, res) => {
  res.status(200).send({ id: req.user.id });
};
exports.postNewPasswordForm = async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.status(400).send('User was not found');
  const newPassword = {
    password: req.body.password,
    repeatPassword: req.body.repeatPassword,
  };
  const { error } = newPasswordValidation(newPassword);
  if (error) return res.status(400).send(error);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword.password, salt);
  try {
    await db.User.update(
      { password: hashedPassword },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    await db.ResetToken.destroy({ where: { id: req.user.id } });
    res.send('Password changed');
  } catch (err) {
    return res.send(err);
  }
};
exports.changePassword = async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.status(400).send('No User was found');
  const newPassword = {
    password: req.body.password,
    repeatPassword: req.body.repeatPassword,
  };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const { error } = newPasswordValidation(newPassword);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    await db.User.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );
    res.send('Password changed');
  } catch (err) {
    return res.send(err);
  }
};
exports.changeEmailAddress = async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.status(400).send('No User was found');
  try {
    await db.Guest.update(
      { email: req.body.email },
      { where: { userId: user.id } }
    );
    res.send('E-Mail Address successfully changed');
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.deleteAccount = async (req,res) =>{
  const { error } = newPasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try{
    await db.User.destroy({where:{id:req.user.id}});
    res.send({ok:true});
  }catch(err)
  {
    res.send(err)
  }
}