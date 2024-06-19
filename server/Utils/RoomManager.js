// roomManager.js
class RoomManager {
    constructor() {
        if (!RoomManager.instance) {
            this.rooms = new Map();
            RoomManager.instance = this;
        }
        return RoomManager.instance;
    }

    // Метод для добавления комнаты
    addRoom(roomName) {
        if (!this.rooms.has(roomName)) {
            this.rooms.set(roomName, { users: [] }); 
        }
        return roomName;
    }

    // Метод для удаления комнаты
    removeRoom(roomName) {
        this.rooms.delete(roomName);
    }

    // Метод для добавления пользователя в комнату
    addUserToRoom(roomName, user) {
        if (this.rooms.has(roomName)) {
            this.rooms.get(roomName).users.push(user);
        } else {
            this.rooms.set(roomName, { users: [user] });
        }
    }

    // Метод для удаления пользователя из комнаты
    removeUserFromRoom(roomName, user) {
        if (this.rooms.has(roomName)) {
            const room = this.rooms.get(roomName);
            room.users = room.users.filter(u => u !== user);
            /* return this.rooms.get(roomName).users; */
        }
        /* return null; */
        
    }

    // Метод для получения информации о комнате
    getRoomInfo(roomName) {
        return this.rooms.get(roomName);
    }

    // Метод для получения всех комнат
    getAllRooms() {
        return Array.from(this.rooms.keys());
    }

    // Метод для получения списка пользователей в комнате
    getUsersInRoom(roomName) {
        if (this.rooms.has(roomName)) {
            return this.rooms.get(roomName).users;
        }
        return [];
    }
}

const instance = new RoomManager();
Object.freeze(instance);

module.exports = instance;
