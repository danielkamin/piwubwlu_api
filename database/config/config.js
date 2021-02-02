require('dotenv').config()
module.exports = {
    development: {
      database: 'MachineRentalDB',
      username: 'postgres',
      password: 'admin123',
      host: 'localhost',
      dialect: 'postgres'
    },
    test: {
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      dialect: 'postgres'
    },
  
    production: {
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      dialect: 'postgres'
    }
}