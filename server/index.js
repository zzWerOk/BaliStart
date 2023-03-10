require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleWare')

const fileUpload = require('express-fileupload')
const path = require("path");


const PORT = process.env.PORT || 5000

const app = express()

app.use('/static', express.static(path.resolve(__dirname, 'static')))

app.use(fileUpload({}))

app.use(cors())

app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

app.get('/', (req, res) => {
    res.json({message: 'Main Ok!'})
})


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

/** Client-Server messaging **/

// const WebSocket = require('ws');
const {connectWebSocketBali} = require("./websocket/messagesFuncs");
// const MESSAGEPORT = process.env.MESSAGEPORT || 3050
// const wss = new WebSocket.Server({port: MESSAGEPORT});

connectWebSocketBali()

/** **/

// broadcastPipeline(wss.clients);
// wss.on('connection', function connection(ws) {
//
//         const interval = individualPipeline(ws);
//         ws.on("close", () => {
//             console.log("closed", wss.clients.size);
//             clearInterval(interval);
//         });
//
//     ws.on('message', function incoming(data) {
//
//         console.log('')
//         console.log('')
//         console.log('')
//         console.log('')
//         console.log(wss.clients.size)
//         console.log('')
//         console.log('')
//         console.log('')
//         console.log('')
//         console.log('')
//
//         wss.clients.forEach(function each(client) {
//             if (client === ws && client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify({status: 'ok'}));
//             }
//         });
//     });
//
// });



start()