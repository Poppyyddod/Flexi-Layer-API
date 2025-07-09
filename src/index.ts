import 'module-alias/register';
import { loadEnvConfig } from '../Configs/env';
const RAW_ENV = loadEnvConfig();

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import GuiderRoutes from '@Helper/Routes';
import { RunHttpsMiddleware } from './Helper/Middlewares/runner.https';
import { RunHttpMiddleware } from './Helper/Middlewares/runner.http';

const app = express();
const router = express.Router();

(async () => {
    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['POST'],
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/v1', await GuiderRoutes(router));
    app.set('json spaces', 2);
})();


let httpServer: any;

RunHttpsMiddleware(app, RAW_ENV.HOST, RAW_ENV.HTTPS_PORT);
httpServer = RunHttpMiddleware(app, RAW_ENV.HOST, RAW_ENV.HTTP_PORT);

console.log(`
    \x1b[33m[!][SERVER] Server Status :
    * NODE ENV -> ${RAW_ENV.NODE_ENV} 
    * HTTP PORT -> ${RAW_ENV.HTTP_PORT} 
    * HTTPS PORT -> ${RAW_ENV.HTTPS_PORT}
    \x1b[0m`);

export default httpServer;

