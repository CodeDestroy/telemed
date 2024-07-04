const rooms = require('../Utils/RoomManager')

class ConferenceController {
    async join (req, res) {
        const conferenceEvent = req.body.conferenceEvent
        //rooms.addUserToRoom(conferenceEvent.roomName, conferenceEvent.id)
        /* const allRooms = rooms.getAllRooms()
        allRooms.forEach(room => {
            console.log(`room ${room}`)
            console.log(rooms.getUsersInRoom(room))
        }) */
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName)
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName, conferenceEvent.id)
        }
        /* if (userList.length > 1) {
            const time = Date.now()
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName, time)
            }
            return res.json({timer: 'start', data: conferenceEvent, time: time})
        } */
       console.log('room info on join: ', rooms.getRoomInfo(conferenceEvent.roomName))
        if (userList.length > 1) {
            /* console.log(`UserList on join: ${userList.length}`) */
            const time = Date.now()
            
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName, time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            /* console.log('join return: ',{timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName)}) */
            return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName)})
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
        rooms.removeUserFromRoom(conferenceEvent.roomName, conferenceEvent.id)
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName)
        /* console.log('leave event: ', conferenceEvent) */
        /* console.log('time in conf: ', rooms.getStartedTimeInRoom(conferenceEvent.roomName)) */
        /* console.log('leave room info: ', rooms.getRoomInfo(conferenceEvent.roomName)) */
        if (userList.length == 0) 
            rooms.removeRoom(conferenceEvent.roomName)
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
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName)
        if (!userList.includes(conferenceEvent.id)) {
            rooms.addUserToRoom(conferenceEvent.roomName, conferenceEvent.id)
        }
        /* console.log('event: ', conferenceEvent) */
        /* console.log('time in conf: ', rooms.getStartedTimeInRoom(conferenceEvent.roomName)) */
        /* console.log('room info: ', rooms.getRoomInfo(conferenceEvent.roomName)) */
        
        if (userList.length > 1) {
            /* console.log(`UserList length: ${userList.length}`) */
            const time = Date.now()
            if ( rooms.getStartedTimeInRoom(conferenceEvent.roomName) == 0) {
                rooms.setStartedTimeInRoom(conferenceEvent.roomName, time)
                return res.json({timer: 'start', data: conferenceEvent, time: time})
            }
            /* console.log(`Time started: ${rooms.getStartedTimeInRoom(conferenceEvent.roomName)}`)
            console.log(`Time current: ${Date.now()}`) */
            return res.json({timer: 'start', data: conferenceEvent, time: rooms.getStartedTimeInRoom(conferenceEvent.roomName)})
        }
        else {
            res.json({data: conferenceEvent});
        }
        /* if (userList.length > 1) {
            return res.json({timer: 'start', data: conferenceEvent})
        } */
        
    }
}

module.exports = new ConferenceController()
