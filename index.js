const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

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
})

http.listen(3000, () => console.log('listening on *:3000'))