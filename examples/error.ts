const io = require('socket.io-client');

const token = '<token>';

// Connect to the server with the token in the headers
const socket = io('ws://localhost:3000', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `${token}`,
      },
    },
  },
});

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('subscribe', {
    block: '19928855',
    alfjd: 'sender',
    sdadf: '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13',
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('transaction', (transaction) => {
  console.log('Received transaction:', transaction);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});

socket.on('connect_error', (error) => {
  console.error('Error: ', error);
});
