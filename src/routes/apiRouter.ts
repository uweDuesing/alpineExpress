import express from 'express';
import {ApiController} from "../controllers/api.controller";
const apiRouter = express.Router();

apiRouter.get('/hello', async (_req, res) => {
    const controller = new ApiController();
    controller.helloWorld(_req, _req).then ((response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(response);
    }, error => {
        res.render('uv/indicator_error');
    });
});
export default apiRouter
