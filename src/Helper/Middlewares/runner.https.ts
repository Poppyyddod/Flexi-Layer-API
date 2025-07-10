import https from 'https';
import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

let cachedHttpsApp: https.Server<typeof IncomingMessage, typeof ServerResponse>;

export const RunHttpsMiddleware = (app: any, hostname: any, port: any) => {
    try {
        const helperPath = "src/Helper/SSL";

        const sslOption = {
            key: fs.readFileSync(`${helperPath}/key.pem`),
            cert: fs.readFileSync(`${helperPath}/cert.pem`)
        }

        const httpsServer = https.createServer(sslOption, app).listen(port, () => {
            // console.log(path.join(helperPath, 'key.pem'));
            // console.log(`On Hostname : ${hostname}`);
            // console.log(`HTTPS Server is running on port ${port}`);
        });

        cachedHttpsApp = httpsServer;

        return httpsServer;
    } catch (error: any) {
        console.log('RunHttpsMiddleware (Error) : ', error);
    }
};

export const CloseHttpsServer = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (cachedHttpsApp) {
            cachedHttpsApp.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        } else {
            resolve();
        }
    });
};