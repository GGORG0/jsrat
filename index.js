const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/victim/index.html');
});
app.get('/v.js', (req, res) => {
  res.sendFile(__dirname + '/frontend/victim/victim.js');
});


app.get('/a', (req, res) => {
  res.sendFile(__dirname + '/frontend/attacker/index.html');
});
app.get('/a/a.js', (req, res) => {
  res.sendFile(__dirname + '/frontend/attacker/attacker.js');
});

let connections = 0;
// TODO: add multiple attackers
let attackerSocket = null;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (role == 'victim') {
      connections++;
      if (attackerSocket) {
        attackerSocket.emit('connections', connections);
      }
    }
  });
  let role = null;
  socket.on('role', (r) => {
    console.log('role: ' + r);
    role = r;

    if (role == 'attacker') {
      attackerSocket = socket;
      socket.emit('connections', connections);
    }
    else if (role == 'victim') {
      connections++;
      if (attackerSocket) {
        attackerSocket.emit('connections', connections);
      }
    }
  });
  socket.on('ping', () => {
    socket.broadcast.emit('ping');
  });
  socket.on('notification', (msg) => {
    socket.broadcast.emit('notification', msg);
  });
  socket.on('music', (msg) => {
    socket.broadcast.emit('music', msg);
  });
  socket.on('stop-music', () => {
    socket.broadcast.emit('stop-music');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});