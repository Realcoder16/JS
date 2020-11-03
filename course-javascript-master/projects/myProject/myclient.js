import {hideLogin} from "./methods.js"
import {showLogin} from "./methods.js"
import {hideMain} from "./methods.js"
import {showMain} from "./methods.js"
import {set} from "./methods.js"
import {get} from "./methods.js"



const ws = new WebSocket('ws://localhost:5500');

const btn = document.querySelector('[data-role=login-submit]');
const loginError = document.querySelector('[data-role=login-error]');

btn.addEventListener('click', function () {
  const UserName = document.querySelector('[data-role=login-name-input]').value;

  if (!UserName ) {
    loginError.textContent = 'Введите никнейм';
  } else {
    const request = {
      type: 'login',
      message: UserName 
    }
    ws.send(JSON.stringify(request));
  }
  


});


ws.onmessage = function (event) {

  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'login':
      console.log(message.responseBody);
      hideLogin();
      showMain();
      set(message.responseBody);
      break;

  }
};
//
ws.onerror = function (err) {
  console.error(err);
}

ws.onopen = function () {
  console.log('Client Connect');
}

ws.onclose = function () {
  console.log('Server Die');
}
