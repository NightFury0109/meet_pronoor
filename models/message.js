const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sender_time: {
    type: Sequelize.STRING
  },
  receiver_time: {
    type: Sequelize.STRING
  },
  filepath: {
    type: Sequelize.STRING
  },
  filename: {
    type: Sequelize.STRING
  },
  message_type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'text'
  },
  live_time: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  show_status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
});

module.exports = Message;