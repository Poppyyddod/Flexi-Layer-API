

export const RunHttpMiddleware = (app: any, hostname: any, port: any) => { 
    try {
        const httpServer = app.listen(port, () => {
            // console.log(`On Hostname : ${hostname}`);
            // console.log(`HTTP Server is running on port ${port}`);
        });

        return httpServer;
    } catch (error: any) {
        console.log('RunHttpsMiddleware (Error) : ', error);
    }
};