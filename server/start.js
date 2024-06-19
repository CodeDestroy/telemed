const http = require("http");
var fs = require('fs');
const { Server } = require("socket.io");
const database = require('./Database/setDatabase');
const { writeFile } = require("fs");


const UrlManager = require('./Utils/UrlManager');
const ApiError = require('./Errors/api-error');
const { app, HTTP_PORT, HOST } = require('.');
const {httpSocket} = require('./Sockets/mainSocket')

const start = async () => {
    try {
        await database.sync({ force: true });
        // const server = https.createServer(options, app);
        const httpServer = http.createServer(app);
        /* const chalk = await import('chalk'); */
        const chalk = await import('chalk');
        httpServer.listen(HTTP_PORT, () => {
            console.log(`HTTP Server started on port ${HTTP_PORT} URL ${HOST}`);
        });

        await httpSocket(httpServer, [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'])
        //const io = new Server(server, {path: '/mysocket/', cors: {origin: [process.env.CLIENT_URL]}});
        /* const ioHTTP = new Server(httpServer, { cors: { origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'] } }); */
        /* server.listen(PORT, () => {
            console.log(`HTTPS Server started on port ${PORT} URL ${HOST}`)
        }); */
        /* let map = new Map(); */

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
       /*  ioHTTP.on('connection', async (socket) => {

            ioConnections.push(socket);
            console.log(`Connections count:`, ioConnections.length);

            var interval;
            socket.on('user:login', async (token) => {
                try {
                    var decoded = jwt.verify(token, process.env.JITSI_SECRET);
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
                    });
                    if (user) {
                        socket.emit('user:logined', true, user);
                    }
                    else {
                        //const newUser = await database.models.Users.create({login: decoded.context.user.login, password: decoded.context.user.password})
                        throw ApiError.AuthError('Невалидный токен, пользователь не найден');
                    }
                } catch (err) {
                    console.log(err.message);
                }
            });


            socket.on('room:join', async (roomName, userId, jwt) => {


                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomName
                    }
                });
                if (!room) {
                    return socket.emit('room:joined', false, null);

                }
                socket.join(room.id);
                const ids = room.usersId;
                let arr = [];
                const messages = await database.models.Messages.findAll({
                    where: {
                        roomId: room.id
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
                for (const message of messages) {
                    let files = await database.models.Files.findAll({ where: { messageId: message.id } });

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
                    });
                    arr.push(new MessageDto(message, files, user));
                }
                socket.emit('room:joined', true, room.id);
                socket.emit('message:returnAll', arr, arr.length);
            });

            socket.on('message:upload', async (text, file, name, type, roomId, userId) => {
                let i = 0;
                const files_created = [];
                let room = await database.models.Rooms.findByPk(roomId);

                const message = await database.models.Messages.create({ text: text, roomId: room.id, userId });
                if (file) {


                    if (!fs.existsSync(`./public/files/${room.id}`)) {
                        fs.mkdirSync(`./public/files/${room.id}`);
                    }
                    const fileName = `${Date.now().toString()}_${name}`;
                    writeFile(`./public/files/${room.id}/${fileName}`, file, async (err) => {
                        console.log({ message: err ? "failure" : "success" });
                    });

                    const file_created = await database.models.Files.create({ path: `/files/${room.id}/${fileName}`, name: name, type: type, messageId: message.id });
                    files_created.push(file_created);
                }

                const user = await database.models.Users.findByPk(userId);
                ioHTTP.to(room.id).emit('message:return', message, user, files_created, 1);
            });
            socket.on('room:leave', async (roomId) => {
                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomId
                    }
                });
                socket.leave(room.id);
            });
            socket.on('disconnect', function (data) {
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            });

            socket.on('leave', async (roomId) => {
                const room = await database.models.Rooms.findOne({
                    where: {
                        roomName: roomId
                    }
                });
                console.log('leaved', roomId);
                socket.leave(room.id);
                map.delete(socket);
                clearInterval(interval);
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            });

            socket.on('disconnect', function (data) {
                socket.leave(map.get(socket));
                map.delete(socket);
                clearInterval(interval);
                ioConnections.splice(ioConnections.indexOf(socket), 1);
            });

        }); */
    }
    catch (e) {
        console.log(e);
    }
};
exports.start = start;
