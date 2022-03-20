const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/assets'));

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});

var users = {};

io.on('connection', (socket) => {

    socket.on('join', function(username) {
        users[socket.id] = username;
        socket.emit('update',`Hi 👋  ${username}, welcome to this simple chat app.`);
        io.emit('update', `${username} has joined the chat.`);
        io.emit('update-users',users);
    });

    socket.on('chat message',(msg) => {
        io.emit('chat message', msg, users[socket.id]);
    });

    socket.on('typing',() => {
        io.emit('typing',`${users[socket.id]} is typing a message ...`);
    })

    socket.on('disconnect',function(){
        io.emit('update',`${users[socket.id]} has left the chat.`);
        delete users[socket.id];
        io.emit('update-users', users);
    });
});

server.listen(port, ()=> {
    console.log('listening on *:'+port);
});