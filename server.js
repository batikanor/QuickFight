const express = require('express')
const app = express()
const path = require('path') 
const server = require('http').createServer(app) 
const io = require('socket.io')(server) 
const port = process.env.PORT || 3000 


server.listen(port, () => {
    console.log('Server listening at port %d', port) 
}) 
  
// Routing
app.use(express.static(path.join(__dirname, 'public'))) 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html') 
}) 

io.on('connection', (socket) => {
    console.log('got a connection now!')
    socket.on('stateUpdate', function(player) {
       io.sockets.emit('stateUpdateForwardedByServer', player) 
    })
}) 