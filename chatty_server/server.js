const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

broadcast = (data) => {
  for(let client of wss.clients) {
    if (client.readyState === 1) {
      console.log('sending data from chatty server to all users');
      client.send(data);
    }
  }
}

handleMessage = (data) => {
  const messageData = JSON.parse(data);
  messageData.id = uuidv1();
  broadcast(JSON.stringify(messageData));
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', handleMessage);
  ws.on('close', () => console.log('Client disconnected'));
});
