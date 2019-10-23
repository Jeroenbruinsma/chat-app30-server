const {Router} = require("express")
const Sse = require('json-sse')
const Chatroom = require('./model')

const router = new Router()
const stream = new Sse()

router.post('/message', async(request,response)=>  {
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

router.get('/stream', async (request, response) => {
    console.log('got a request on stream')
    const room = await Chatroom.findAll()
    const data = JSON.stringify(room)
    //console.log('messages in this room are',data)

    stream.updateInit(data)
    stream.init(request,response)
})

module.exports = router

