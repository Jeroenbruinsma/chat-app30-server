const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require('body-parser')
const Sse = require('json-sse')
const cors = require('cors')



const stream = new Sse()

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";


const jsonParser = bodyParser.json()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(jsonParser)

app.listen(port, () => console.log("listning on port ", port));

const db = new Sequelize(databaseUrl);

const Chatroom =  db.define('chatroom',{
    message: Sequelize.STRING,
    user: Sequelize.STRING
})


db.sync({ force: false })
  .then(() => console.log("database synced"))
  .catch(error => console.log("got an error", error));

app.get('/', (request, response )=>{
    console.log("got an get request on /")
    response.status(200)
    response.send("hello world")
})
app.post('/message', async(request,response)=>  {
    console.log('got a request on /message',request.body)
    const {message } = request.body
    const entity = await Chatroom.create({
        message,
        user: "its me"
    })

    const room = await Chatroom.findAll()
    const data = JSON.stringify(room)
    stream.send(data)
    response.status(200)
    response.send("thanks for your messsage")
    
})

app.get('/stream', async (request, response) => {
    console.log('got a request on stream')
    const room = await Chatroom.findAll()
    const data = JSON.stringify(room)
    //console.log('messages in this room are',data)

    stream.updateInit(data)
    stream.init(request,response)
})
