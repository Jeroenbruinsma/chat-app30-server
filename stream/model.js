const Sequelize = require("sequelize")
const db = require('../db')
const User = require("../user/model")


const Chatroom =  db.define('chatroom',{
    message: Sequelize.STRING,
    
})


module.exports = Chatroom