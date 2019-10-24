const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require('body-parser')
const cors = require('cors')

const user = require('./user/router')
const signup = require('./auth/router')
const stream = require('./stream/router')


const jsonParser = bodyParser.json()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(jsonParser)
app.use(user)
app.use(signup)
app.use(stream)

app.listen(port, () => console.log("listning on port ", port));

app.get('/', (request, response )=>{
    console.log("got an get request on /")
    response.status(200)
    response.send("hello world")
})