const app = require('./app')
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const application = express()
const server = http.createServer(application)
const io = socketio(server)

const portal =process.env.PORTAL || 8000
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

application.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('new websocket connection')

    //Join to chat listener
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    //when you sending a server message events
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    //sharing your location server events
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    //when you disconnect server message
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

//Listen server
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

//Chat ekranı için localhost:8000' i aç
server.listen(portal, () => {
    console.log(`Server is up on port ${portal}`)
})

