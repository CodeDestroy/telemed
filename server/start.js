const http = require("http");
var fs = require('fs');
const { Server } = require("socket.io");
const database = require('./Database/setDatabase');
const { writeFile } = require("fs");
var https = require('https');

const UrlManager = require('./Utils/UrlManager');
const ApiError = require('./Errors/api-error');
const { app, HTTP_PORT, HOST } = require('.');
const {httpSocket, httpsSocket} = require('./Sockets/mainSocket')
/* var options = {
    key: fs.readFileSync('./keys1/privkey.pem'),
    cert: fs.readFileSync('./keys1/fullchain.pem')
  }; */
const start = async () => {
    try {
        await database.sync({ force: true });
        /* const httpsServer = https.createServer(options, app); */
        const httpServer = http.createServer(app);
        /* const chalk = await import('chalk'); */
        const chalk = await import('chalk');
        httpServer.listen(HTTP_PORT, () => {
            console.log(`HTTP Server started on port ${HTTP_PORT} URL ${HOST}`);
        });
        /* httpsServer.listen(PORT, () => {
            console.log(`Server started on port ${PORT} URL ${HOST}`) 
          }); */
        await httpSocket(httpServer, [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'])
        //await httpsSocket(httpsServer, [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'])
    }
    catch (e) {
        console.log(e);
    }
};
exports.start = start;
