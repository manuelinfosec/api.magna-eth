# api.magna-eth

## Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

### Install

- Install all dependencies with `yarn install`

### Running in dev mode

- Run `yarn start`
- The server address will be displayed to you as `http://0.0.0.0:3000`

### Building the project and run it

- Run `yarn build` to generated all JavaScript files from the TypeScript sources.
- the builded app located in `dist`.

## Assumptions

- There will always be active nodes from Ethereum Node List

## API Documentation

### Stream

Request Example:

```javascript
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

console.log('Connecting...');

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('subscribe', {
    block: '19928855',
    type: 'all',
    address: '0xf7858da8a6617f7c6d0ff2bcafdb6d2eedf64840',
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
```

### Stream Filters

1. All Events

```javascript
socket.emit('subscribe', {
  type: 'all',
});
```

2. Only Events Where an Address is Either the Sender or Receiver

```javascript
socket.emit('subscribe', {
  block: 0x130161f,
  type: 'all',
  address: '0xEthereumAddress',
});
```

3. Only Events Where an Address is the Sender

```javascript
socket.emit('subscribe', {
  type: 'sender',
  address: '0xEthereumAddress',
});
```

4. Only Events Where an Address is the Receiver

```javascript
socket.emit('subscribe', {
  type: 'receiver',
  address: '0xYourEthereumAddress',
});
```

5. Events Within Value Ranges (in USD)

Assuming that 1 ETH = 5,000 USD

a. 0 - 100 USD

```javascript
socket.emit('subscribe', {
  range: '0-100',
});
```

b. 0 - 100 USD

```javascript
socket.emit('subscribe', {
  range: '100-500',
});
```

c. 500 - 2000 USD

```javascript
socket.emit('subscribe', {
  range: '500-2000',
});
```

d. 2000 - 5000 USD

```javascript
socket.emit('subscribe', {
  range: '2000-5000',
});
```

e. Greater than 5000 USD

```javascript
socket.emit('subscribe', {
  range: '>5000',
});
```

**Response Example:**
The response will be a stream of blocks in the following format:

```javascript
{
  blockHash: '0xed248d2e7e09c0537d6535b400f2fb918bd75211514add200baf44e18bcee265',
  blockNumber: '0x13dcd5',
  from: '0x32be343b94f860124dc4fee278fdcbd38c102d88',
  gas: '0x51615',
  gasPrice: '0x6fc23ac00',
  hash: '0xecff100f3c0d5a60666e9dea1cf027dcce144fdc75de0cc0aec1dafb75495b57',
  input: '0x',
  nonce: '0x9f55',
  to: '0x15a84e4bb094162df86cd2d75d6a63c85177e306',
  transactionIndex: '0x4',
  value: '0x9184e72a000',
  type: '0x0',
  v: '0x1b',
  r: '0x70f16b79421db3b2b710a54a1a2c59f9970fcb078b4c5eaccb179c97a9d7b6eb',
  s: '0x260a67b7975f851038e108654b8ecb3e070d6ef1395339aff12e31c39c54ddc0'
}
```
