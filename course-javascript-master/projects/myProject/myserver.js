const WebSocket = require('ws');
const webSocketConfig = new WebSocket.Server({ port: 5500 });

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const uuidv1 = require('uuid/v1');

const adapter = new FileSync('db.json')
const db = low(adapter)


webSocketConfig.on('connection', function (wsParams) {
  wsParams.on('message', function (data) {
    const message = JSON.parse(data);


    switch (message.type) {
      case 'login':
        const id = uuidv1();
        db.get('users').push({ id: id, UserName : message.message })
          .write();

        const response = {
          type: 'login',
          responseBody: message.message
        }

        wsParams.send(JSON.stringify(response));
        break;
    }
  });
});

