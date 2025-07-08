import https from 'https';
import fs from 'fs';
import path from 'path';

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

        return httpsServer;
    } catch (error: any) {
        console.log('RunHttpsMiddleware (Error) : ', error);
    }
};