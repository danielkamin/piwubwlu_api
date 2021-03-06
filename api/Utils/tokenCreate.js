const jwt = require('jsonwebtoken')
exports.createAccessToken = (user, roles,userName) => {
  return jwt.sign({ id: user.id, role: roles,userName:userName }, process.env.ACCESS_TOKEN, {
    expiresIn: '1h',
  });
};
exports.createRefreshToken = (user, roles,userName) => {
  return jwt.sign(
    { id: user.id, role: roles,userName:userName  },
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
