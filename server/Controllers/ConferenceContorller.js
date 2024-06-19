const rooms = require('../Utils/RoomManager')

class ConferenceController {
    async join (req, res) {
        const conferenceEvent = req.body.conferenceEvent
        rooms.addUserToRoom(conferenceEvent.roomName, conferenceEvent.id)
        const allRooms = rooms.getAllRooms()
        /* allRooms.forEach(room => {
            console.log(rooms.getUsersInRoom(room))
        }) */
        /* console.log(rooms.getAllRooms()) */

        res.json({data: conferenceEvent});
    }

    async leave (req, res) {
        /* const data = req.body
        console.log(data)
        return res.status(200) */
        const conferenceEvent = req.body.conferenceEvent
        //const roomName = req.body.roomName
        /* console.log(conferenceEvent) */
        rooms.removeUserFromRoom(conferenceEvent.roomName, conferenceEvent.id)
        const userList = rooms.getUsersInRoom(conferenceEvent.roomName)
        /* if (userList.length  > 0) {
            rooms.removeRoom(conferenceEvent.roomName)
        } */

        const allRooms = rooms.getAllRooms()
        /* allRooms.forEach(room => {
            console.log(rooms.getUsersInRoom(room))
        }) */
        res.json({data: conferenceEvent});
    }

}

module.exports = new ConferenceController()
