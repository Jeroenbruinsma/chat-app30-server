const Sequelize = require("sequelize")
const db = require('../db')


const Chatroom =  db.define('chatroom',{
    message: Sequelize.STRING,
    user: Sequelize.STRING
})


module.exports = Chatroom