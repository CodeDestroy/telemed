const ConsultationService = require('../Services/ConsultationService')
const rooms = require('../Utils/RoomManager')
const UrlManager = require('../Utils/UrlManager')
const MailManager = require('../Utils/MailManager')

const database = require('../Database/setDatabase')
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_URL = process.env.CLIENT_URL;
class ConferenceController {
    async join (req, res) {
        const conferenceEvent = req.body.conferenceEvent

        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        }
        /* console.log('join')
        console.log(console.log(rooms)) */
        if (userList.length > 1) {
            const time = Date.now()
            
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase()) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName.toLowerCase(), time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            else {
                return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase())})
            }
        }
        else {
            res.json({data: conferenceEvent});
        }
    }

    async leave (req, res) {

        const conferenceEvent = req.body.conferenceEvent

        rooms.removeUserFromRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        if (userList.length == 0) {
            const tmk = await ConsultationService.getSlotByRoomName(conferenceEvent.roomName)
            //Оставить на потом
            /* if (roomInfo.started === 0)
                return res.status(406).json({message: 'Консультация не была инициирована'}) */
            //tmk.Room.ended = true;
            //tmk.Room.meetingEnd = new Date();
            /* tmk.Room.protocol = protocol */
            //tmk.slotStatusId = 4
            //tmk.Room.save()
            //tmk.save()
            rooms.removeRoom(conferenceEvent.roomName.toLowerCase())
        }
        res.json({data: conferenceEvent});
    }

    async participantJoined (req, res) {
        const conferenceEvent = req.body.conferenceEvent
/*         console.log(conferenceEvent) */
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        }
        /* console.log('participantJoined')
        console.log(console.log(rooms)) */
        if (userList.length > 1) {
            const time = Date.now()
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName.toLowerCase(), time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            else {
                return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase())})
            }
        }
        else {
            res.json({data: conferenceEvent});
        }
        
    }

    async endConference (req, res) {
        try {
            
            const roomName =  (req.body.roomName)
            const protocol = req.body.protocol
            /* const roomInfo = rooms.getRoomInfo(roomName.toLowerCase()) */
            const tmk = await ConsultationService.getSlotByRoomName(roomName)
            //Оставить на потом
            /* if (roomInfo.started === 0)
                return res.status(406).json({message: 'Консультация не была инициирована'}) */
            tmk.Room.ended = true;
            tmk.Room.meetingEnd = new Date();
            tmk.Room.protocol = protocol
            tmk.slotStatusId = 4
            tmk.Room.save()
            tmk.save()
            rooms.removeRoom(roomName.toLowerCase())
            res.status(200).json(tmk)
        }
        catch (e) {
            res.status(400).send(e.message)
        }
    }

    async setConferenceProtocol (req, res) {
        try {
            const {roomId} = req.body
            const {protocol} = req.body
            
            const tmk = await ConsultationService.getSlotByRoomId(roomId)
           
            tmk.Room.protocol = protocol

            tmk.Room.save()
            res.status(200).json(tmk)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }

    async sendConferenceProtocol (req, res) {
        try {
            const {roomId} = req.body
            
            const tmk = await ConsultationService.getSlotByRoomId(roomId)
            //throw new Error('Ошибка отправки')

            const url = `${CLIENT_URL}/protocol/${tmk.Room.roomName}`
            const shortUrl = await UrlManager.createShort(url, tmk.Patient.User.id, tmk.Room.id, "protocol")
            const transporter = await MailManager.getTransporter()
            const link =  SERVER_DOMAIN + 'short/' + shortUrl;
            
            if (tmk.Patient.User.email) {
                const mailOptionsPatinet = await MailManager.getMailOptionsProtocolLink(tmk.Patient.User.email, link, tmk.Room.protocol)
                const info = await transporter.sendMail(mailOptionsPatinet);

                console.log('Сообщение отправлено: %s', info.messageId);

                await database.models.Rooms.increment('sendCount', {
                    by: 1,
                    where: { id: tmk.Room.id },
                });

                await tmk.Room.save();
            }
            
            res.status(200).json(tmk)
            
        }
        catch (e) {
            console.log(e)
            res.status(404).json({error: e.message})
        }
    }

     async getProtocolByRoomName(req, res) {
        try {
            const {roomName} = req.query
            const tmk = await ConsultationService.getSlotByRoomName(roomName)
            res.status(200).json(tmk.Room.protocol)
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        
    }

    async getSlotByRoomName (req, res) {
        try {
            const {roomName} = req.query
            const tmk = await ConsultationService.getSlotByRoomName(roomName)
            res.status(200).json(tmk)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async setEndConsultation(req, res) {
        try {

            const { id } = req.params
            const {endTime} = req.body
            const tmk = await ConsultationService.getSlotById(id)
            tmk.slotStatusId = 4;
            tmk.Room.ended = true
            tmk.Room.meetingEnd = endTime
            await tmk.Room.save()
            await tmk.save()
            res.status(200).json(tmk.Room)

        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    

    
}

module.exports = new ConferenceController()
