const WebSocket = require('ws');
const MESSAGEPORT = process.env.MESSAGEPORT || 3050
const wss = new WebSocket.Server({port: MESSAGEPORT});
const jwt = require('jsonwebtoken')

function connectWebSocketBali() {

    // broadcastPipeline(wss.clients);

    wss.on('connection', function connection(ws, res) {
        const {token} = getParams(res);

        let currUser = null

        if (token) {
            currUser = jwt.verify(token, process.env.SECRET_KEY)
            ws.user = currUser
        }

        // const interval = individualPipeline(ws);
        ws.on("close", () => {
            console.log("closed", wss.clients.size);
            // clearInterval(interval);
        });

        // ws.on('message', function incoming(data) {
        ws.on('message', function (data) {

            const messageJson = JSON.parse(data.toString())

            if (messageJson?.type === 'SEND_MESSAGE') {

                let chatUserId = -1

                chatUserId = messageJson?.payload?.recipient || -1

                wss.clients.forEach(function each(client) {
                    if (client === ws && client.readyState === WebSocket.OPEN) {
                        const systemMessageJSON = {
                            type: 'SYSTEM_MESSAGE',
                            message: 'new_message',
                        }
                        client.send(JSON.stringify(systemMessageJSON));
                    }
                    if (chatUserId > -1) {
                        // console.log('')
                        // console.log('')
                        // console.log(chatUserId)
                        // console.log('')
                        // console.log('')
                        // console.log('')
                        if (client.user.id === chatUserId && client.readyState === WebSocket.OPEN) {
                            const systemMessageJSON = {
                                type: 'SYSTEM_MESSAGE',
                                message: 'new_message',
                            }
                            client.send(JSON.stringify(systemMessageJSON));
                        }
                    }

                });
            }

        });

    });

}

module.exports = {connectWebSocketBali}


// available as part of nodejs
const url = require("url");

/** returns the path and params of input url
 the url will be of the format '/demo?token=<token_string> **/
const getParams = (request) => {
    try {
        const parsed = url.parse(request.url);
        const res = {path: parsed.pathname};
        // split our query params
        parsed.query.split("&").forEach((param) => {
            const [k, v] = param.split("=");
            res[k] = v;
        });
        return res;
    } catch (err) {
        return "na";
    }
};


// function individualPipeline(ctx) {
//     let idx = 0;
//     return setInterval(() => {
//         ctx.send(JSON.stringify({status: 'ok', message: `ping pong ${idx}`}));
//         idx++;
//     }, 5000);
// }
//
// /** broadcast messages
//  one instance for all clients **/
// function broadcastPipeline(clients) {
//     let idx = 0;
//     return setInterval(() => {
//         for (let c of clients.values()) {
//             c.send(JSON.stringify({status: 'ok', message: `broadcast message ${idx}`}));
//         }
//         idx++;
//     }, 3000);
// }