const config = {
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  port: process.env.PORT || 5000,
};

module.exports = config;
