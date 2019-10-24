const Sequelize = require('sequelize')
const sequelize = require('../db')
const  Chatroom = require('../stream/model')

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

User.hasMany(Chatroom)
Chatroom.belongsTo(User)


module.exports = User