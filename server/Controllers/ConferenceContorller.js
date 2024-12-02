const ConsultationService = require('../Services/ConsultationService')
const rooms = require('../Utils/RoomManager')

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
        if (userList.length == 0) 
            rooms.removeRoom(conferenceEvent.roomName.toLowerCase())

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
            const tmk = await ConsultationService.getSlotByRoomName(roomName.toLowerCase())
            //Оставить на потом
            /* if (roomInfo.started === 0)
                return res.status(406).json({message: 'Консультация не была инициирована'}) */
            tmk.room.ended = true;
            tmk.room.meetingEnd = new Date();
            tmk.room.protocol = protocol
            tmk.slotStatusId = 4
            tmk.room.save()
            tmk.save()
            rooms.removeRoom(roomName.toLowerCase())
            res.status(200).json(tmk)
        }
        catch (e) {
            res.status(400).send(e.message)
        }
    }
}

module.exports = new ConferenceController()
