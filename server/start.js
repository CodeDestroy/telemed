const http = require("http");

const { Server } = require("socket.io");
const database = require('./Database/setDatabase');

var https = require('https');
const fs = require('fs');
const UrlManager = require('./Utils/UrlManager');
const ApiError = require('./Errors/api-error');
const { app, HTTP_PORT, HOST, HTTPS_PORT } = require('.');
const {httpSocket, httpsSocket} = require('./Sockets/mainSocket');
const healthyChildApi = require("./Api/healthyChildApi");
/* var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/clinicode.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/clinicode.ru/fullchain.pem')
  }; */
const start = async () => {
    try {
        /* const testData = await healthyChildApi.getOnlineSched() 
        console.log(testData)*/
        /* const testOnlineClient = await healthyChildApi.getOnlineClientInfo('ff607cfb-eab5-11ee-a02d-00155d014d04')
        6827ea0a-3dd6-11ef-a030-00155d014d04
        const testOnlineRequestInfo = await healthyChildApi.getOnlineRequestInfo('ac8de4a8-3dd6-11ef-a030-00155d014d04')
        const testOnlineRequestInfo = await healthyChildApi.getOnlineRequestInfo('6827ea0a-3dd6-11ef-a030-00155d014d04')
        console.log(testOnlineRequestInfo) */
        const testEmp = await healthyChildApi.getOnlineEmployeeInfo('db4a58cc-3f04-11ed-8baa-00155d08797d')
        /* if (process.env.NODE_ENV == 'development')
            await database.sync({ force: true });
        else
            await database.sync(); */
        /* const httpsServer = https.createServer(options, app); */
        const db = require('./models/index')
        /* console.log(await db["Users"].findByPk(1)) */
        const httpServer = http.createServer(app);
        /* const chalk = await import('chalk'); */
        const chalk = await import('chalk');
        httpServer.listen(HTTP_PORT, () => {
            console.log(`HTTP Server started on port ${HTTP_PORT} URL ${HOST}`);
        });
        /* httpsServer.listen(HTTPS_PORT, () => {
            console.log(`Server started on port ${HTTPS_PORT} URL ${HOST}`) 
        }); */
        await httpSocket(httpServer, [process.env.CLIENT_URL, 'https://www.clinicode.ru/' , 'http://localhost:3000', 'http://localhost:3000/', 'http://127.0.0.1:3000', 'http://clinicode.ru:9881', 'http://clinicode.ru', 'https://clinicode.ru', 'http://clinicode.ru:3000'])
        //await httpsSocket(httpsServer, [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://clinicode.ru:9881', 'http://clinicode.ru', 'https://clinicode.ru', 'http://clinicode.ru:3000'])
    }
    catch (e) {
        console.log(e);
    }
};
exports.start = start;
