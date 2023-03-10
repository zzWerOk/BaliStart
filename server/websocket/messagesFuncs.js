const WebSocket = require('ws');
const MESSAGEPORT = process.env.MESSAGEPORT || 3050
const wss = new WebSocket.Server({port: MESSAGEPORT});

function connectWebSocketBali () {

    broadcastPipeline(wss.clients);

    wss.on('connection', function connection(ws) {

        console.log('')
        console.log('')
        console.log('')
        console.log('')
        console.log('connection')
        console.log(wss.clients.size)
        console.log('')
        console.log('')
        console.log('')
        console.log('')
        console.log('')
        const interval = individualPipeline(ws);
        ws.on("close", () => {
            console.log("closed", wss.clients.size);
            clearInterval(interval);
        });

        ws.on('message', function incoming(data) {

            console.log('')
            console.log('')
            console.log('')
            console.log('')
            console.log(wss.clients.size)
            console.log('')
            console.log('')
            console.log('')
            console.log('')
            console.log('')

            wss.clients.forEach(function each(client) {
                if (client === ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({status: 'ok'}));
                }
            });
        });

    });

}

module.exports = {connectWebSocketBali}

function individualPipeline(ctx) {
    let idx = 0;
    const interval = setInterval(() => {
        ctx.send(JSON.stringify({status: 'ok', message: `ping pong ${idx}`}));

        // ctx.send(`ping pong ${idx}`);
        idx++;
    }, 5000);
    return interval;
}

// braodcast messages
// one instance for all clients
function broadcastPipeline(clients) {
    let idx = 0;
    const interval = setInterval(() => {
        for (let c of clients.values()) {
            c.send(JSON.stringify({status: 'ok', message: `broadcast message ${idx}`}));

            // c.send(`broadcast message ${idx}`);
        }
        idx++;
    }, 3000);
    return interval;
}