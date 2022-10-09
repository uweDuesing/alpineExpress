import express, { Application } from 'express';
import morgan from 'morgan';
import Router from './routes/default.route';
import * as WebSocket from 'ws';

import path from 'path';
const PORT = process.env.PORT || 4200;
const app: Application = express();

const wsServer = WebSocket.server({
    noServer: true
})

wsServer.on("connection", function(ws) {    // what should a websocket do on connection
    ws.on("message", function(msg) {        // what to do on message event
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(msg.toString());
            }
        })
    })
})



app.set('view engine', 'pug');
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.use('/assets', express.static(path.join(__dirname, '/public')));
app.disable('x-powered-by');
// this has to happen after /assets or we'd be logging all of them too
app.all('*',function(req, res, next){
    const logPacket = {
        referer: req.get('referer'), // useful to know who is actually embedding our widgets
        route: req.path, // useful to know which widget configurations are popular
        'user-agent': req.get('user-agent'), // useful to check that our widgets work with the popular clients
        'accept-language': req.get('accept-language') // useful to know if we should be translating into other languages
    };
    console.log(JSON.stringify(logPacket)); // NOSONAR
    next();
});

app.use(Router);
const httpServer = app.listen(PORT, () => {
    console.log('Server is running on port', PORT); // NOSONAR
});

httpServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event


    // if(Math.random() > 0.5){
    //     return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     //proper connection close in case of rejection
    // }

    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
});
