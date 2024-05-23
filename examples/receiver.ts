const io = require('socket.io-client');

const token = 'token';

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
    type: 'receiver',
    address: '0x0ba67296022e5ce374b3aa2d6d56f4b4822600a3',
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
