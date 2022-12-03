// TODO: add accept and reject messages
Notification.requestPermission();

var socket = io();
socket.emit('role', 'victim');

socket.on('ping', () => {
  console.log('ping');
  socket.emit('pong');
});
socket.on('notification', (msg) => {
  new Notification(msg);
});
let audio = null;
socket.on('music', (url) => {
  audio = new Audio(url);
  audio.play();
});
socket.on('stop-music', (url) => {
  audio.pause();
});