const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Token = sequelize.define('token', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Date.now
  },
  expires: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3600
  }
});

module.exports = Token;