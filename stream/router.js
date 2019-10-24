const {Router} = require("express")
const Sse = require('json-sse')
const Chatroom = require('./model')
const auth = require('../auth/middelware')

const router = new Router()
const stream = new Sse()

router.post('/message', auth, async(request,response)=>  {
    console.log('got a request on /message',request.body)
    const {message } = request.body
    console.log("message from user w id: ", request.user.id )
    const entity = await Chatroom.create({
        message,
        userId:  request.user.id
    })

    const room = await Chatroom.findAll()
    const data = JSON.stringify(room)
    stream.send(data)
    response.status(200)
    response.send("thanks for your messsage")
    
})

router.get('/stream', async (request, response) => {
    console.log('got a request on stream')
    const room = await Chatroom.findAll()
    const data = JSON.stringify(room)
    //console.log('messages in this room are',data)

    stream.updateInit(data)
    stream.init(request,response)
})

module.exports = router

