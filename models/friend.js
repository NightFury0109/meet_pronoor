const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Friend = sequelize.define('friend', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Friend;