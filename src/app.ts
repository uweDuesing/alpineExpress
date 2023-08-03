import express, {Application} from 'express';
import morgan from 'morgan';
import Router from './routes/default.route';
import WebSocket, {WebSocketServer} from 'ws';

import path from 'path';

const PORT = process.env.PORT || 4200;
const app: Application = express();

const wsServer = new WebSocketServer({
    noServer: true
})
let counter = 0;
wsServer.on("connection", (ws) => {    // what should a websocket do on connection
    setInterval(() => {
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(counter);
            }
        })
        counter ++;
    }, 100)
})


app.set('view engine', 'pug');
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.use('/assets', express.static(path.join(__dirname, '/public')));
app.disable('x-powered-by');
// this has to happen after /assets or we'd be logging all of them too
app.all('*', function (req, res, next) {
    const logPacket = {
        referer: req.get('referer'), // useful to know who is actually embedding our widgets
        route: req.path, // useful to know which widget configurations are popular
        'user-agent': req.get('user-agent'), // useful to check thatwidgets work with the popular clients
        'accept-language': req.get('accept-language') // useful to know if we should be translating into other languages
    };
    next();
});

app.use(Router);
const httpServer = app.listen(PORT, () => {
    console.log('Server is running on port', PORT); // NOSONAR
});

httpServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event

    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
});
