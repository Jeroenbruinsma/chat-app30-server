const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require('body-parser')
const Sse = require('json-sse')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const secret = process.env.JWT_SECRET || 'e9rp^&^*&@9sejg)DSUA)jpfds8394jdsfn,m'

function toJWT(data) {
  return jwt.sign(data, secret, { expiresIn: '2h' })
}

function toData(token) {
  return jwt.verify(token, secret)
}



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

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'users'
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

//make a new user

app.post(
  '/user',
  (request, response, next) => {
    const password = bcrypt
      .hashSync(request.body.password, 10)

    const user = { ...request.body, password }

    User
      .create(user)
      .then(user => response.send(user))
      .catch(next)
  }
)


//send users a jwt token after login

app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    res.status(400).send({
      message: 'Please supply a valid email and password'
    })
  }
  else {
    User
    .findOne({
      where: {
        email: req.body.email
      }
    })
    .then(entity => {
      if (!entity) {
        res.status(400).send({
          message: 'User with that email does not exist'
        })
      }
  
      // 2. use bcrypt.compareSync to check the password against the stored hash
      else if (bcrypt.compareSync(req.body.password, entity.password)) {
  
        // 3. if the password is correct, return a JWT with the userId of the user (user.id)
        res.send({
          jwt: toJWT({ userId: entity.id })
        })
      }
      else {
        res.status(400).send({
          message: 'Password was incorrect'
        })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).send({
        message: 'Something went wrong'
      })
    })
  }
})


