const ws = new WebSocket('ws://localhost:5500');

const btn = document.getElementById('sendForm');
// const btnLogin = document.getElementById('sendLogin');
//
btn.addEventListener('click', function () {
    const userName = document.getElementById('loginText').value;

    const request = {
        type: 'login',
        message: userName
    }
    ws.send(JSON.stringify(request));
});


ws.onmessage = function (event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'login':
            alert(message.responseBody);
            break;
        default:
            console.error('Unknown RequestType');
            break;
    }
}
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
