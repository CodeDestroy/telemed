const express = require('express')
const app = express();
exports.app = app;
require('dotenv').config()
const cors = require('cors');
var https = require('https');
const HOST = process.env.SERVER_URL;
exports.HOST = HOST;
const HTTP_PORT = process.env.HTTP_PORT;
exports.HTTP_PORT = HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
exports.HTTPS_PORT = HTTPS_PORT;
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* const Database = require('./Database')
const database = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST) */
/* DB_USER = "postgres"
DB_PASSWORD = "admin"
DB_HOST = "localhost"
DB_NAME = "tmk" */

const mainRouter = require('./Routers/MainRouter')
const authRouter = require('./Routers/AuthRouter');
const conferenceRouter = require('./Routers/ConferenceRouter')
const shortUrlRouter = require('./Routers/ShortUrlRouter')
const integrationRouter = require('./Routers/IntegrationRouter')
const doctorRouter = require('./Routers/DoctorRouter')
const { start } = require('./start');
const adminRouter = require('./Routers/AdminRouter')
const AuthMiddleware = require('./middleware/AuthMiddleware')
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://clinicode.ru:9881', 'http://clinicode.ru'],
}));

app.use(bodyParser.urlencoded({ 
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/short', shortUrlRouter)
app.use('/api', mainRouter);
app.use('/api', authRouter);
app.use('/api/conference', conferenceRouter)
app.use('/api/integration', integrationRouter)
app.use('/api/doctor', AuthMiddleware, doctorRouter)
app.use('/api/admin', AuthMiddleware, adminRouter)
ioConnections = [];

start();
