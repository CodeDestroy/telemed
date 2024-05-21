const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors');
var https = require('https');
const http = require("http");
var fs = require('fs');
const HOST = process.env.SERVER_URL;
const HTTP_PORT = process.env.HTTP_PORT;
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
var bodyParser = require('body-parser');
const database = require('./Database/setDatabase')
const { writeFile } = require("fs");
const MessageDto = require('./Dtos/MessageDto')
var jwt = require('jsonwebtoken');
/* const Database = require('./Database')
const database = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST) */
/* DB_USER = "postgres"
DB_PASSWORD = "admin"
DB_HOST = "localhost"
DB_NAME = "tmk" */

const mainRouter = require('./Routers/MainRouter')
const authRouter = require('./Routers/AuthRouter');
const ApiError = require('./Errors/api-error');

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
}));

app.use(bodyParser.urlencoded({ 
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', mainRouter);
app.use('/api', authRouter);
ioConnections = [];

const start = async () => {
    try {
        await database.sync( /* { force: true } */ );
       // const server = https.createServer(options, app);
        const httpServer = http.createServer(app)
        httpServer.listen(HTTP_PORT, ()=> {
            console.log(`HTTP Server started on port ${HTTP_PORT} URL ${HOST}`) 
        });
    
        //const io = new Server(server, {path: '/mysocket/', cors: {origin: [process.env.CLIENT_URL]}});
        const ioHTTP = new Server(httpServer, {cors: {origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']}});
        /* server.listen(PORT, () => {
            console.log(`HTTPS Server started on port ${PORT} URL ${HOST}`) 
        }); */
        let map = new Map();
    
        /* io.on('connection', async (socket) => {
            
            ioConnections.push(socket);
            console.log(`Connections count:`, ioConnections.length) 
            
            var interval;
            socket.on('room:join', async (roomId) => {
            console.log('joined')
            
            io.to(socket.id).emit('hello', 'some data firstly');
    
            map.set(socket, roomId)
            console.log('joined', roomId)
            socket.emit('room:joined', roomId)
    
            interval = setInterval(async () => {
                // отправляем данные клиенту
                io.to(socket.id).emit('hello', 'some data');
            }, 30000)

        })
    
        socket.on('leave', (roomId) => {
            console.log('leaved', roomId)
            socket.leave(roomId);
            map.delete(socket)
            clearInterval(interval)
            ioConnections.splice(ioConnections.indexOf(socket), 1);
        })
            
        socket.on('disconnect', function(data) { 
            socket.leave(map.get(socket));
            map.delete(socket)
            clearInterval(interval)
            ioConnections.splice(ioConnections.indexOf(socket), 1);
        });
    
        });  */
  
        ioHTTP.on('connection', async (socket) => {
            
            ioConnections.push(socket);
            console.log(`Connections count:`, ioConnections.length) 
            
            var interval;
            /* socket.on('room:join', async (roomId) => {
                console.log('joined')
                
                ioHTTP.to(socket.id).emit('hello', 'some data firstly');
        
                map.set(socket, roomId)
                console.log('joined', roomId)
                socket.emit('room:joined', roomId)

                
        

            }) */

            socket.on('user:login', async (token) => {
                /* console.log('\x1b[41m%s\x1b[0m', token) */
                try {
                    var decoded = jwt.verify(token, process.env.JITSI_SECRET);
                    console.log('\x1b[41m%s\x1b[0m', decoded.context.user)
                    const user = await database.models.Users.findByPk(decoded.context.user.id, {
                        include: [
                            {
                                model: database.models.UsersRoles,
                                required: true,
                            },
                            {
                                model: database.models.Doctors,
                                required: false
                            },
                            {
                                model: database.models.Patients,
                                required: false
                            },
                            {
                                model: database.models.Admins,
                                required: false
                            },
                        ]
                    })
                    if (user) {
                        socket.emit('user:logined', true, user) 
                    }
                    else {
                        throw ApiError.AuthError('Невалидный токен, пользователь не найден')
                    }
                  } catch(err) {
                    console.log(err.message)
                  }
                /* const user = {}
                socket.emit('user:registered', true, user) */
            })


            socket.on('room:join', async (roomName, userId ,jwt) => {

                /* if (!userId && jwt) {
                    const newUser = await data.models.Users.create({login: })
                } */
                
                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomName 
                    }
                }) 
                socket.join(room.id); 
                const ids = room.usersId;
                let arr = []
               // const allMessages = await database.models.Messages.findAll({'roomId': roomId}).sort({createdAt: 1}).where('userId').in(ids).where('roomId') 
                const messages = await database.models.Messages.findAll({
                    where: {
                        roomId: room.id
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                })
                /* console.log(messages) */
                for (const message of messages) {
                    let files = await database.models.Files.findAll({where: {messageId: message.id}})

                    const user = await database.models.Users.findOne({
                        where: {
                            id: message.userId, 
                        },
                        include: [
                            {
                                model: database.models.UsersRoles,
                                required: true,
                            },
                            {
                                model: database.models.Doctors,
                                required: false
                            },
                            {
                                model: database.models.Patients,
                                required: false
                            },
                            {
                                model: database.models.Admins,
                                required: false
                            },
                        ]
                    })
                    /* console.log(user) */
                    arr.push(new MessageDto(message, files ,user))
                } 
                socket.emit('room:joined', true, room.id)
                socket.emit('message:returnAll', arr, arr.length)
            }) 
        
            socket.on('message:upload', async (text, file, name, type, roomId, userId) => {
                let i = 0;
                const files_created = []
                let room = await database.models.Rooms.findByPk(roomId)

                const message = await database.models.Messages.create({text: text, roomId: room.id, userId});
                if (file) {
                    

                    if (!fs.existsSync(`./public/files/${room.id}`)) {
                        fs.mkdirSync(`./public/files/${room.id}`);
                    }
                    /* console.log(types[i]) */
                    const fileName = `${Date.now().toString()}_${name}`
                    /* console.log(file) */
                    writeFile(`./public/files/${room.id}/${fileName}`, file, async (err) => {
                        console.log({ message: err ? "failure" : "success" });
                    });
                    
                    const file_created = await database.models.Files.create({path: `/files/${room.id}/${fileName}`, name: name, type: type, messageId: message.id});
                    files_created.push(file_created)
                }
                
                const user = await database.models.Users.findByPk(userId)
                ioHTTP.to(room.id).emit('message:return', message, user, files_created, 1)
            });
            socket.on('room:leave', async (roomId) => {
                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomId 
                    }
                }) 
                socket.leave(room.id)
            })
            socket.on('disconnect', function(data) { 
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            });
    
            socket.on('leave', async (roomId) => {
                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomId 
                    }
                }) 
                console.log('leaved', roomId)
                socket.leave(room.id);
                map.delete(socket)
                clearInterval(interval)
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            })
                
            socket.on('disconnect', function(data) { 
                socket.leave(map.get(socket));
                map.delete(socket)
                clearInterval(interval)
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            });
  
        }); 
    }
    catch (e) {
        console.log(e)
    }
}
start();
