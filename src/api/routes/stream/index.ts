export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    // Debugging connection issues
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Example of handling a custom event
    socket.on('message', (msg) => {
    console.log(socket.user)
      console.log('message received: ' + msg.test);
      // Echo the message back to the client
      io.emit('message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
