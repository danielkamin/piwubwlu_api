const jwt = require('jsonwebtoken')
exports.createAccessToken = (user, roles) => {
  return jwt.sign({ id: user.id, role: roles }, process.env.ACCESS_TOKEN, {
    expiresIn: '1h',
  });
};
exports.createRefreshToken = (user, roles) => {
  return jwt.sign(
    { id: user.id, role: roles },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '7d',
    }
  );
};
exports.createResetToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.RESET_TOKEN,
    {
      expiresIn: '3h',
    }
  );
};
