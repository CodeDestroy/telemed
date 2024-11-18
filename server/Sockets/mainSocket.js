
const { Server } = require("socket.io");
var jwt = require('jsonwebtoken');
var fs = require('fs');
const { writeFile } = require("fs");
const bcrypt = require('bcryptjs');
const UserManager = require("../Utils/UserManager");
let map = new Map();
const database = require('../models/index');
const MessageDto = require('../Dtos/MessageDto');
const rooms = require('../Utils/RoomManager')
const httpSocket = async (httpServer, [cors]) => {
    const ioHTTP = new Server(httpServer, { cors: cors, maxHttpBufferSize: 1e8 } );
    ioHTTP.on('connection', async (socket) => {

        ioConnections.push(socket);
        console.log(`Connections count:`, ioConnections.length);

        var interval;

        socket.on('user:login', async (token) => {
            try {
                var decoded = jwt.verify(token, process.env.JITSI_SECRET);
                const decodedUser = decoded.context.user;
                const user = await database["Users"].findByPk(decodedUser.id, {
                    include: [
                        {
                            model: database["UsersRoles"],
                            required: true,
                        },
                        {
                            model: database["Doctors"],
                            required: false
                        },
                        {
                            model: database["Patients"],
                            required: false
                        },
                        {
                            model: database["Admins"],
                            required: false
                        },
                    ]
                });
                //НЕ ПОЛУЧАЕМ ID ПОЧЕМУ ТО
                /* console.log(decodedUser)
                console.log(user) */

                if (decodedUser.avatar != '') {
                    user.avatar = decodedUser.avatar;
                    await user.save();
                }
                if (user) {
                    socket.emit('user:logined', true, user);
                }
                else {
                    const userRole = decoded.moderator == 'true' ? 2 : 1 ;
                    const pass_to_hash = decoded.context.user.name.valueOf();
                    const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
                    const newUser = await database["Users"].create({login: decoded.context.user.name, password: decoded.context.user.hashPassword, userRoleId: userRole, avatar: decodedUser.avatar, email: decodedUser.email  })
                    const fio = await UserManager.parseFullName(decodedUser.name);
                    
                    if (userRole == 2) {
                        await this.models.Doctors.create({userId: newUser.id, secondName: fio.secondName, firstName: fio.firstName, patronomicName: fio.patronomicName, birthDate: new Date(), info: decodedUser.name})
                    }
                    else {
                        await this.models.Patients.create({userId: newUser.id, secondName: fio.secondName, firstName: fio.firstName, patronomicName: fio.patronomicName, birthDate: new Date(), info: decodedUser.name})
                    }

                    const newFindedUser = await database["Users"].findByPk(newUser.id, {
                        include: [
                            {
                                model: database["UsersRoles"],
                                required: true,
                            },
                            {
                                model: database["Doctors"],
                                required: false
                            },
                            {
                                model: database["Patients"],
                                required: false
                            },
                            {
                                model: database["Admins"],
                                required: false
                            },
                        ]
                    });
                    socket.emit('user:logined', true, newFindedUser);
                    
                    
                    /* 
                    const testUserDoctor = await this.models.Users.create({login: 'test', password: hashPassword, userRoleId: doctorRole.id})
                    const testDoctor = await this.models.Doctors.create({userId: testUserDoctor.id, secondName: 'Тестов', firstName: 'Тест', patronomicName: 'Тестович', birthDate: new Date(), info: 'Тестовый доктор'})
                    */

                    /* throw ApiError.AuthError('Невалидный токен, пользователь не найден'); */
                }
            } catch (err) {
                console.log(err.message);
            }
        });


        socket.on('room:join', async (roomName, userId, jwt) => {
            const room = await database["Rooms"].findOne({
                where: {
                    roomName: roomName
                }
            });
            if (!room) {
                return socket.emit('room:joined', false, null);

            }
            socket.join(room.id);
            
            console.log(room)
            /* const ids = room.usersId; */
            let arr = [];
            
            const messages = await database["Messages"].findAll({
                where: {
                    roomId: room.id
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            console.log(messages)
            for (const message of messages) {
                let files = await database["Files"].findAll(/* { where: { messageId: message.id } } */);
                console.log(files)
                const user = await database["Users"].findOne({
                    where: {
                        id: message.userId,
                    },
                    include: [
                        {
                            model: database["UsersRoles"],
                            required: true,
                        },
                        {
                            model: database["Doctors"],
                            required: false
                        },
                        {
                            model: database["Patients"],
                            required: false
                        },
                        {
                            model: database["Admins"],
                            required: false
                        },
                    ]
                });

                arr.push(new MessageDto(message, files, user));
            }
            socket.emit('room:joined', true, room.id);
            socket.emit('message:returnAll', arr, arr.length);
        });
        //socket.emit('message:upload', message, files, name, type, roomId, store.user.id);
        socket.on('message:upload', async (text, file, name, type, roomId, userId) => {
            let i = 0;
            const files_created = [];
            /* console.log(`text: ${text} roomId: ${roomId} userId: ${userId}` ) */
            let room = await database["Rooms"].findByPk(roomId);
            /* console.log(text) */
            const message = await database["Messages"].create({ text: text, roomId: room.id, userId });
            if (file) {


                if (!fs.existsSync(`./public/files/${room.id}`)) {
                    fs.mkdirSync(`./public/files/${room.id}`);
                }

                const fileName = `${Date.now().toString()}_${name}`;
                writeFile(`./public/files/${room.id}/${fileName}`, file, async (err) => {
                    console.log({ message: err ? "failure" : "success" });
                });

                const file_created = await database["Files"].create({ path: `/files/${room.id}/${fileName}`, name: name, type: type, messageId: message.id });
                files_created.push(file_created);
            }

            const user = await database["Users"].findByPk(userId, {
                include: [
                    {
                        model: database["UsersRoles"],
                        required: true,
                    },
                    {
                        model: database["Doctors"],
                        required: false
                    },
                    {
                        model: database["Patients"],
                        required: false
                    },
                    {
                        model: database["Admins"],
                        required: false
                    },
                ]
            });
            ioHTTP.to(room.id).emit('message:return', message, user, files_created, 1);
        });
        socket.on('room:leave', async (roomId) => {
            const room = await database["Rooms"].findOne({
                where: {
                    roomName: roomId
                }
            });
            socket.leave(room.id);
        });

        /* socket.on('timer:start', async (nativeEvent) => {
            console.log(nativeEvent)
        }) */

        socket.on('disconnect', function (data) {
            ioConnections.splice(ioConnections.indexOf(socket), 1);
        });

        socket.on('leave', async (roomId) => {
            const room = await database["Rooms"].findOne({
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

    });
}

const httpsSocket = async (httpsServer, [cors]) => {
    const io = new Server(httpsServer, {cors: cors, maxHttpBufferSize: 1e8});
    io.on('connection', async (socket) => {

        ioConnections.push(socket);
        console.log(`Connections count:`, ioConnections.length);

        var interval;

        socket.on('user:login', async (token) => {
            try {
                var decoded = jwt.verify(token, process.env.JITSI_SECRET);
                const decodedUser = decoded.context.user;
                const user = await database["Users"].findByPk(decodedUser.id, {
                    include: [
                        {
                            model: database["UsersRoles"],
                            required: true,
                        },
                        {
                            model: database["Doctors"],
                            required: false
                        },
                        {
                            model: database["Patients"],
                            required: false
                        },
                        {
                            model: database["Admins"],
                            required: false
                        },
                    ]
                });

                if (decodedUser.avatar != '') {
                    user.avatar = decodedUser.avatar;
                    await user.save();
                }
                if (user) {
                    socket.emit('user:logined', true, user);
                }
                else {
                    const userRole = decoded.moderator == 'true' ? 2 : 1 ;
                    const pass_to_hash = decoded.context.user.name.valueOf();
                    const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
                    const newUser = await database["Users"].create({login: decoded.context.user.name, password: decoded.context.user.hashPassword, userRoleId: userRole, avatar: decodedUser.avatar, email: decodedUser.email  })
                    const fio = await UserManager.parseFullName(decodedUser.name);
                    
                    if (userRole == 2) {
                        await this.models.Doctors.create({userId: newUser.id, secondName: fio.secondName, firstName: fio.firstName, patronomicName: fio.patronomicName, birthDate: new Date(), info: decodedUser.name})
                    }
                    else {
                        await this.models.Patients.create({userId: newUser.id, secondName: fio.secondName, firstName: fio.firstName, patronomicName: fio.patronomicName, birthDate: new Date(), info: decodedUser.name})
                    }

                    const newFindedUser = await database["Users"].findByPk(newUser.id, {
                        include: [
                            {
                                model: database["UsersRoles"],
                                required: true,
                            },
                            {
                                model: database["Doctors"],
                                required: false
                            },
                            {
                                model: database["Patients"],
                                required: false
                            },
                            {
                                model: database["Admins"],
                                required: false
                            },
                        ]
                    });
                    socket.emit('user:logined', true, newFindedUser);
                    
                    
                    /* 
                    const testUserDoctor = await this.models.Users.create({login: 'test', password: hashPassword, userRoleId: doctorRole.id})
                    const testDoctor = await this.models.Doctors.create({userId: testUserDoctor.id, secondName: 'Тестов', firstName: 'Тест', patronomicName: 'Тестович', birthDate: new Date(), info: 'Тестовый доктор'})
                    */

                    /* throw ApiError.AuthError('Невалидный токен, пользователь не найден'); */
                }
            } catch (err) {
                console.log(err.message);
            }
        });


        socket.on('room:join', async (roomName, userId, jwt) => {
            const room = await database["Rooms"].findOne({
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
            
            const messages = await database["Messages"].findAll({
                where: {
                    roomId: room.id
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            console.log(messages)
            for (const message of messages) {
                let files = await database["Files"].findAll({ where: { messageId: message.id } });

                const user = await database["Users"].findOne({
                    where: {
                        id: message.userId,
                    },
                    include: [
                        {
                            model: database["UsersRoles"],
                            required: true,
                        },
                        {
                            model: database["Doctors"],
                            required: false
                        },
                        {
                            model: database["Patients"],
                            required: false
                        },
                        {
                            model: database["Admins"],
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
            let room = await database["Rooms"].findByPk(roomId);
            console.log(roomId)
            const message = await database["Messages"].create({ text: text, roomId: room.id, userId });
            if (file) {


                if (!fs.existsSync(`./public/files/${room.id}`)) {
                    fs.mkdirSync(`./public/files/${room.id}`);
                }

                const fileName = `${Date.now().toString()}_${name}`;
                writeFile(`./public/files/${room.id}/${fileName}`, file, async (err) => {
                    console.log({ message: err ? "failure" : "success" });
                });

                const file_created = await database["Files"].create({ path: `/files/${room.id}/${fileName}`, name: name, type: type, messageId: message.id });
                files_created.push(file_created);
            }

            const user = await database["Users"].findByPk(userId, {
                include: [
                    {
                        model: database["UsersRoles"],
                        required: true,
                    },
                    {
                        model: database["Doctors"],
                        required: false
                    },
                    {
                        model: database["Patients"],
                        required: false
                    },
                    {
                        model: database["Admins"],
                        required: false
                    },
                ]
            });
            io.to(room.id).emit('message:return', message, user, files_created, 1);
        });
        socket.on('room:leave', async (roomId) => {
            const room = await database["Rooms"].findOne({
                where: {
                    roomName: roomId
                }
            });
            socket.leave(room.id);
        });

        /* socket.on('timer:start', async (conferenceEvent) => {
            console.log(conferenceEvent)
            const userList = rooms.getUsersInRoom(conferenceEvent.roomName)
            const room = await database["Rooms.findOne({
                where: {
                    roomName: conferenceEvent.roomName
                }
            });

        })
        socket.on('disconnect', function (data) {
            ioConnections.splice(ioConnections.indexOf(socket), 1);
        }); */

        socket.on('leave', async (roomId) => {
            const room = await database["Rooms"].findOne({
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

    });
}

module.exports = {httpSocket, httpsSocket}