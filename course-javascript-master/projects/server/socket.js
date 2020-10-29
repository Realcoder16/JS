class Socket  {
    constructor(wss) {
        this.events = []
        this.connections = wss.clients
        this.connection(wss)
    }

    connection(wss){
        wss.on('connection', ws => {
            this.onMessage(ws)
            this.onClose(ws)
            this.emit = (event, data) =>{
                ws.send(JSON.stringify({
                    event,
                    payload: data
                }))
            }
            this.broadcast = (event, data, all = true) => {
                this.connections.forEach(connect => {
                    if (!all && connect.id === ws.id) return

                    connect.send(JSON.stringify({
                        event,
                        payload: data
                    }))
                 })
            }
        })
    }

    onClose(ws) {
        ws.on('close', () => {
            this.emmiter('disconnect', ws.id)
        })
    }

    onMessage(ws) {
        ws.on('message', (data) => {
            data = JSON.parse(data);
            // data => {event: 'users:connect', payload: {user: {...}}}
            this.emmiter(data.event, data.payload, ws)
        })
    }

    emmiter(eventName, data, ws) { 
        const index = this.events.findIndex((item) => item.event === eventName)

        if (index >= 0) this.events[index].cb(data, ws)
    }

    on(eventName, cb){
        this.events.push({
            event: eventName,
            cb
        })
    }
}

module.exports = Socket