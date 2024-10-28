const ConsultationService = require('../Services/ConsultationService')
const rooms = require('../Utils/RoomManager')

class ConferenceController {
    async join (req, res) {
        /* console.log(rooms.getAllRooms()) */
        const conferenceEvent = req.body.conferenceEvent
        //rooms.addUserToRoom(conferenceEvent.roomName, conferenceEvent.id)
        /* const allRooms = rooms.getAllRooms()
        allRooms.forEach(room => {
            console.log(`room ${room}`)
            console.log(rooms.getUsersInRoom(room))
        }) */
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        }
        /* if (userList.length > 1) {
            const time = Date.now()
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName, time)
            }
            return res.json({timer: 'start', data: conferenceEvent, time: time})
        } */
        /* console.log('room info on join: ', rooms.getRoomInfo(conferenceEvent.roomName.toLowerCase())) */
        if (userList.length > 1) {
            /* console.log(`UserList on join: ${userList.length}`) */
            const time = Date.now()
            
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase()) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName.toLowerCase(), time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            /* console.log('join return: ',{timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName)}) */
            return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase())})
        }
        else {
            res.json({data: conferenceEvent});
        }
        
        /* console.log(rooms.getAllRooms()) */

        
    }

    async leave (req, res) {
        /* const data = req.body
        console.log(data)
        return res.status(200) */
        const conferenceEvent = req.body.conferenceEvent
/*         console.log(conferenceEvent) */
        //const roomName = req.body.roomName
        /* console.log(conferenceEvent) */
        rooms.removeUserFromRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        /* console.log('leave event: ', conferenceEvent) */
        /* console.log('time in conf: ', rooms.getStartedTimeInRoom(conferenceEvent.roomName)) */
        /* console.log('leave room info: ', rooms.getRoomInfo(conferenceEvent.roomName.toLowerCase())) */
        if (userList.length == 0) 
            rooms.removeRoom(conferenceEvent.roomName.toLowerCase())
        /* if (userList.length  < 2) {
            return res.json({timer: 'stop', data: conferenceEvent})
        } */
        

        /* const allRooms = rooms.getAllRooms() */
        /* allRooms.forEach(room => {
            console.log(rooms.getUsersInRoom(room))
        }) */
        res.json({data: conferenceEvent});
    }

    async participantJoined (req, res) {
        const conferenceEvent = req.body.conferenceEvent
/*         console.log(conferenceEvent) */
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName.toLowerCase())
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName.toLowerCase(), conferenceEvent.id)
        }
        /* console.log('event: ', conferenceEvent) */
        /* console.log('time in conf: ', rooms.getStartedTimeInRoom(conferenceEvent.roomName)) */
        console.log('room info: ', rooms.getRoomInfo(conferenceEvent.roomName.toLowerCase()))
        
        if (userList.length > 1) {
            /* console.log(`UserList length: ${userList.length}`) */
            const time = Date.now()
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName.toLowerCase(), time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            /* console.log(`Time started: ${rooms.getStartedTimeInRoom(conferenceEvent.roomName)}`)
            console.log(`Time current: ${Date.now()}`) */
            return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName.toLowerCase())})
        }
        else {
            res.json({data: conferenceEvent});
        }
        /* if (userList.length > 1) {
            return res.json({timer: 'start', data: conferenceEvent})
        } */
        
    }

    async endConference (req, res) {
        try {
            /* console.log(rooms.getAllRooms()) */
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
            /* console.log(tmk)*/
            /* console.log(roomInfo)  */
            /* console.log(rooms.getAllRooms()) */
            res.status(200).json(tmk)
        }
        catch (e) {
            res.status(400).send(e.message)
        }
    }
}

module.exports = new ConferenceController()
