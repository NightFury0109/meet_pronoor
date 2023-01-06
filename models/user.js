const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'off'
  },
  block: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = User;