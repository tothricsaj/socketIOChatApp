const path = require('path')
const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)


let participants = new Set()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

io.on('connection', (socket) => {
    
    // io.emit('chat message', 'A user connected!')

    socket.on('disconnect', (reason) => {
        io.emit('chat message', `a user disconnected!!!!`)
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

    socket.on('participants', (name) => {
        participants.add(name)
        io.emit('participants', [...participants])
    })

    socket.on('typingListener', (typer) => {
        io.emit('typingListener', typer)
    })
})

http.listen(3000, () => console.log('listening on *:3000'))