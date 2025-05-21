import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import GuiderRoutes from '@Helper/Routes';
import { mongodb } from '@Configs/Database';
import { RunHttpsMiddleware } from './Helper/Middlewares/runner.https';
import { RunHttpMiddleware } from './Helper/Middlewares/runner.http';

const app = express();
const HTTP_PORT = process.env.HTTP_SERVER_PORT;
const HTTPS_PORT = process.env.HTTPS_SERVER_PORT;
const HOSTNAME = process.env.HOST;
const apiVersion = "v2.0.0";
const router = express.Router();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    await mongodb.testConnection();
})();

app.use(`/${apiVersion}`, GuiderRoutes(router));
app.set('json spaces', 2);

app.get('/flexi-layer-api', (req: any, res: any) => {
    res.json({ message: "Welcome to Flexi Layer API!!" });
});

const httpsServer = RunHttpsMiddleware(app, HOSTNAME, HTTPS_PORT);

const httpServer = RunHttpMiddleware(app, HOSTNAME, HTTP_PORT);

// Test fetch origin and pull it

export default httpServer as any;

