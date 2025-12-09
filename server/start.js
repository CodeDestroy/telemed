const http = require("http");
const https = require("https");
const fs = require("fs");

const { app, HTTP_PORT, HOST, HTTPS_PORT } = require(".");
const { httpSocket, httpsSocket } = require("./Sockets/mainSocket");

// Пути к сертификатам (для production)
const SSL_KEY_PATH = "/home/loginparol0/certs/privkey.pem";
const SSL_CERT_PATH = "/home/loginparol0/certs/fullchain.pem";

const start = async () => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    let httpServer;
    let httpsServer;

    if (isProduction) {
      // Проверяем наличие файлов сертификата
      if (!fs.existsSync(SSL_KEY_PATH) || !fs.existsSync(SSL_CERT_PATH)) {
        throw new Error("SSL сертификаты не найдены! Проверьте пути.");
      }

      const options = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
      };

      httpsServer = https.createServer(options, app);
      httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server started on port ${HTTPS_PORT} URL ${HOST}`);
      });

      // Также можно поднять HTTP и редиректить на HTTPS
      httpServer = http.createServer((req, res) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
      });
      httpServer.listen(HTTP_PORT, () => {
        console.log(`HTTP Server started on port ${HTTP_PORT} (redirect to HTTPS)`);
      });

      await httpsSocket(
        httpsServer,
        [
          process.env.CLIENT_URL,
          "https://www.clinicode.ru/",
          "http://localhost:3000",
          "http://localhost:3000/",
          "http://127.0.0.1:3000",
          "http://clinicode.ru:9881",
          "http://clinicode.ru",
          "https://clinicode.ru",
          "http://clinicode.ru:3000",
        ]
      );
    } else {
      // Development: обычный HTTP
      httpServer = http.createServer(app);
      httpServer.listen(HTTP_PORT, () => {
        console.log(`HTTP Server started on port ${HTTP_PORT} URL ${HOST}`);
      });

      await httpSocket(
        httpServer,
        [
          process.env.CLIENT_URL,
          "https://www.clinicode.ru/",
          "http://localhost:3000",
          "http://localhost:3000/",
          "http://127.0.0.1:3000",
          "http://clinicode.ru:9881",
          "http://clinicode.ru",
          "https://clinicode.ru",
          "http://clinicode.ru:3000",
        ]
      );
    }
  } catch (e) {
    console.error("Server start error:", e);
  }
};

exports.start = start;
