# api.magna-eth

## Problem Statement

We want to track the activities on the block for our analysis application. For this application, we want to stream the transactions on the blockchain as they happen. We care about the following fields:

- Sender Address
- Receiver Address
- BlockNumber
- BlockHash
- TransactionHash
- Gas Price in WEI
- Value in WEI

On completion, your API should be a `socket.io` endpoint that will allow me to subscribe to events in the following ways:

1. All events.
2. Only events where an address is either the sender or receiver.
3. Only events where an address is the sender.
4. Only events where an address is the receiver.
5. Assume that 1 ETH = $5,000 and send events within the ranges:
   - 0 - 100
   - 100 - 500
   - 500 - 2000
   - 2000 - 5000
   - > 5000

We do not want just anyone to access our socket endpoints, so we will need an HTTP endpoint to register and log in. All requests to the `socket.io` endpoint will require a JWT token.

#### Requirements and Constraints

1. Build this project using Node/Typescript.
2. Use a MySQL or Postgres database.
3. Use TypeORM for the entities you create.
4. Use Typedi for dependency injection.
5. Handle errors correctly and return useful error messages when there are issues.
6. Use appropriate data structures and algorithms to optimize your solution and minimize resource consumption.
7. An ETH block is confirmed in ~12 seconds. Blocks can have up to ~1,500 transactions in them (but are typically around 500 or less). You should do your best to make sure your API can handle sending this much data.
8. Public Ethereum RPC endpoints may be down from time to time or you may run out of free API calls (~300 requests/min). You should pool the connections such that if an RPC is down, you can switch to the next one that is available.

> 💡 **Expo:** This test is about setting up `socket.io` and building a real-time endpoint with it. Ethereum is only a data source that can be swapped for anything in the future.

## Methodologies & Assumptions

- At startup, the public RPC website is scraped to create a pool of active nodes. (It's worth noting that I had connectivity problems accessing the Ethereum Nodes website over MTN network and might fail the startup process).
- A round-robin scheduling strategy is used to acquire a new node from the pool of nodes, in the case of inavailability.
- JWT tokens are set to expire in 7 days.
- There will always be active nodes available from the Ethereum Node List.

## Getting Started

### Step 1: Set up the Development Environment

To get started with the development environment, follow these steps:

1. **Install Node.js and NPM:**
   - **OSX:** Use [Homebrew](http://brew.sh) to install Node.js and NPM:
     ```bash
     brew install node
     ```
   - **Windows:** Use [Chocolatey](https://chocolatey.org/) to install Node.js and NPM:
     ```bash
     choco install nodejs
     ```

### Step 2: Install Dependencies

Install all the necessary dependencies using Yarn:

```bash
yarn install
```

### Step 3: Running in Development Mode

To run the application in development mode, execute:

```bash
yarn start
```

The server will start and running on `http://0.0.0.0:3000`.

### Step 4: Building the Project

To build the project, use the following command:

```bash
yarn build
```

The compiled JavaScript files from the TypeScript sources will be located in the `dist` directory.

## One-Click Run with Docker Compose

For seamless execution, you can run the entire project using Docker Compose. This method simplifies the setup process and ensures all dependencies are correctly configured.

### Docker Compose Setup

1. **Ensure Docker is installed** on your system. You can download it from [Docker's official website](https://www.docker.com/get-started).

2. **Run Docker Compose**:

```bash
docker-compose up
```
A GitHub Action workflow was created to demonstrate the one-click setup, find it in the [Actions](https://github.com/manuelinfosec/api.magna-eth/actions) tab.

This command will start both the Node.js application and a PostgreSQL database. The server will be available at `http://localhost:3000`.

> **Note:** Environment variables are provided in plaintext for ease of execution in a development or test environment. This approach is not recommended for production environments. In production, copy the `env.example` template to `.env` and update its variables.

## API Documentation

For the API endpoints, a Postman collection is available in the [`postman`](/postman/) directory of this project. This collection includes all the necessary endpoints for testing user registration and authentication.

### User Authentication

#### 1. Register User

**URL:** `api/auth/register/`

**Method:** `POST`

Register a new user

**Request Example:**

```
POST api/auth/register/
```

```json
{
  "first_name": "Chiemezie",
  "last_name": "Njoku",
  "username": "chiemezienjoku",
  "email": "njokuchiemezie01@gmail.com",
  "password": "securepassword123()"
}
```

**Response Example:**

```json
{
  "user": {
    "id": "74a3fa76-9bea-4e9b-b03c-0845a4d57175",
    "name": "Chiemezie Njoku",
    "email": "testuser@example.com",
    "createdAt": "2024-05-23T04:20:48.363Z",
    "updatedAt": "2024-05-23T04:20:48.363Z"
  },
  "token": "<token>"
}
```

#### 2. LoginAPI

**URL:** `api/auth/login/`

**Method:** `POST`

Existing user login

**Request Example:**

```
POST api/auth/login/
```

```json
{
  "email": "testuser@example.com",
  "password": "securepassword123()"
}
```

**Response Example:**

```json
{
  "user": {
    "id": "74a3fa76-9bea-4e9b-b03c-0845a4d57175",
    "name": "Chiemezie Njoku",
    "email": "testuser@example.com",
    "createdAt": "2024-05-23T04:20:48.363Z",
    "updatedAt": "2024-05-23T04:20:48.363Z"
  },
  "token": "<token>"
}
```

#### 3. Logout (Not implemented)

- Application relies on expiration of JWT tokens for logout.

#### 4. ProfileAPI

**URL:** `api/auth/profile/`

**Method:** `GET`

Accessing user profile

**Request Example:**

```
GET api/auth/profile/

Headers:
Authorization: Bearer <token>
```

**Response Example:**

```json
{
  "user": {
    "id": "74a3fa76-9bea-4e9b-b03c-0845a4d57175",
    "name": "Chiemezie Njoku",
    "email": "testuser@example.com",
    "createdAt": "2024-05-23T05:20:48.363Z",
    "updatedAt": "2024-05-23T05:20:48.363Z"
  }
}
```

### Socket Stream

#### Client Example

To connect to the server and subscribe to transaction streams, use the following example:

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
    block: null, // can be ignored, integer or hex
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

#### Stream Filters

You can subscribe to different types of transaction streams by specifying the appropriate filters:

1. **All Events**

```javascript
socket.emit('subscribe', {
  type: 'all',
});
```

2. **Events Where an Address is Either the Sender or Receiver**

```javascript
socket.emit('subscribe', {
  block: 0x130161f,
  type: 'all',
  address: '0xEthereumAddress',
});
```

3. **Events Where an Address is the Sender**

```javascript
socket.emit('subscribe', {
  type: 'sender',
  address: '0xEthereumAddress',
});
```

4. **Events Where an Address is the Receiver**

```javascript
socket.emit('subscribe', {
  type: 'receiver',
  address: '0xEthereumAddress',
});
```

5. **Events Within Value Ranges (in USD)**

   Assuming that 1 ETH = 5,000 USD, you can subscribe to events within specific value ranges:

   - **0 - 100 USD**

     ```javascript
     socket.emit('subscribe', {
       range: '0-100',
     });
     ```

   - **100 - 500 USD**

     ```javascript
     socket.emit('subscribe', {
       range: '100-500',
     });
     ```

   - **500 - 2000 USD**

     ```javascript
     socket.emit('subscribe', {
       range: '500-2000',
     });
     ```

   - **2000 - 5000 USD**

     ```javascript
     socket.emit('subscribe', {
       range: '2000-5000',
     });
     ```

   - **Greater than 5000 USD**

     ```javascript
     socket.emit('subscribe', {
       range: '>5000',
     });
     ```

#### Response Example

The response will be a stream of transaction objects in the following format:

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

In the case of an invalid filter, the stream will be in the following format:

```javascript
{
  message: 'RPC error: invalid argument 0: hex string without 0x prefix';
}
```
