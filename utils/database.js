require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres'
});

module.exports = sequelize;