import express, { Application } from 'express';
import morgan from 'morgan';
import Router from './routes/default.route';


import path from 'path';
const PORT = process.env.PORT || 4200;

const app: Application = express();
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
app.listen(PORT, () => {
    console.log('Server is running on port', PORT); // NOSONAR
});
