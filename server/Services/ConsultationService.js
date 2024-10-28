const database = require('../Database/setDatabase');
const { Op } = require('sequelize')
const DateTimeManager = require('../Utils/DateTimeManager')
const moment = require('moment-timezone');
const { raw } = require('body-parser');

const JITSI_APP_ID = process.env.JITSI_APP_ID;
const JITSI_SERVER_URL = process.env.JITSI_SERVER_URL;
class ConsultationService {

    //Все слоты (лучше не использовать)
    async getAllSlots () {
        try {
            /* const slots = await database.models.Slots.findAll({
                include: [{
                    model: database.models.Rooms,
                    required: false
                },
                {
                    model: database.models.Patients,
                    required: false
                }]
            }); */
            const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", *
                from slots s 
                left join rooms r  on s.id = r."slotId" 
                left join patients p on p.id  = s."patientId" 
                join doctors d on d.id = s."doctorId" 
                join urls url on url."userId" = d."userId" 
                join urls url2 on url2."userId" = p."userId" 
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id `, 
            {
                raw: false
            })
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }

    async getAllSlotsInMO (userId) {
        try {
            const user = await database.models.Users.findByPk(userId, {
                include: [{
                    model: database.models.Admins,
                    required: true,
                }]
            })
            console.log(user)
            if (user.admin.medOrgId) {
                const slots = await database.sequelize.query(`
                    select s.id as "id" , 
                        p."firstName" as "pFirstName", 
                        p."secondName" as "pSecondName", 
                        p."patronomicName" as "pPatronomicName", 
                        d."firstName" as "dFirstName", 
                        d."secondName" as "dSecondName", 
                        d."patronomicName" as "dPatronomicName", 
                        url."shortUrl" as "dUrl", 
                        url2."shortUrl" as "pUrl", *
                    from slots s 
                    left join rooms r  on s.id = r."slotId" 
                    left join patients p on p.id  = s."patientId" 
                    join doctors d on d.id = s."doctorId" 
                    join urls url on url."userId" = d."userId" 
                    join urls url2 on url2."userId" = p."userId" 
                    where 
                        d."medOrgId" = ${user.admin.medOrgId} and
                        url2."roomId" = r.id 
                        and url."roomId" = r.id `, 
                {
                    raw: false
                })
                return slots;
            }
            else {
                throw new Error('Не найдена Мед Организация, обратитесь в поддержку.')
            }
        }
        catch (e) {
            console.log(e)
            throw e
        }   
    }

    async getAllDoctorSlotsRaw(doctorId) {
        try {
            /* const slots = await database.models.Slots.findAll({
                include: [{
                    model: database.models.Rooms,
                    required: false
                },
                {
                    model: database.models.Patients,
                    required: false
                }]
            }); */
            const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", *
                from slots s 
                left join rooms r  on s.id = r."slotId" 
                left join patients p on p.id  = s."patientId" 
                join doctors d on d.id = s."doctorId" 
                join urls url on url."userId" = d."userId" 
                join urls url2 on url2."userId" = p."userId" 
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and d.id = ${doctorId}`, 
                    
            {
                raw: false
            })
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Все актульные слоты
    async getAllActiveSlots () {
        try {
            const currTime = await DateTimeManager.getCurrentDateTimeWithTimezone(3) //Заглушка, 3 - часовой пояс (+3 - мск), необходимо реализовать поиск по ip по таймзоне
            const slots = await database.models.Slots.findAll({ 
                where: {
                    doctorId: { 
                        [Op.ne]: null
                    },
                    slotStartDateTime: {
                        [Op.gt]: currTime
                    }

                },
                include: [
                    {
                        model: database.models.Rooms,
                        required: false
                    },
                    {
                        model: database.models.Patients,
                        required: false
                    }
                ]
            },{
                raw: true
            })
            return slots
        }
        catch (e) {
            console.log(e)
        }
    }

    //Возвращаем все слоты по врачу
    async getAllDoctorSlots(doctorId) {
        try {
            const slots = await database.models.Slots.findAll({
                where: {
                    doctorId: doctorId
                },
                include: [{
                    model: database.models.Rooms,
                    required: false
                },
                {
                    model: database.models.Patients,
                    required: false
                }]
            })
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }



    async getEndedDoctorSlots (doctorId) {
        try {
            const currTime = new Date().toISOString();
                        
            const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", *
                from slots s 
                left join rooms r  on s.id = r."slotId" 
                left join patients p on p.id  = s."patientId" 
                join doctors d on d.id = s."doctorId" 
                join urls url on url."userId" = d."userId" 
                join urls url2 on url2."userId" = p."userId" 
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."doctorId" = :doctorId 
                    and (r."ended" = true) 
                    and (s."slotStartDateTime" < :currTime or s."slotStatusId" = 4)`, 
            {
                replacements: { doctorId: doctorId, currTime: currTime }, 
                raw: true
            })
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join rooms r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Возвращаем все акуальные слоты по врачу
    async getActiveDoctorSlots(doctorId) {
        try {
            const currTime = new Date().toISOString();
                        
            const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", *
                from slots s 
                left join rooms r  on s.id = r."slotId" 
                left join patients p on p.id  = s."patientId" 
                join doctors d on d.id = s."doctorId" 
                join urls url on url."userId" = d."userId" 
                join urls url2 on url2."userId" = p."userId" 
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."doctorId" = :doctorId 
                    and (r."ended" != true or r."ended" is null) `, 
            {
                replacements: { doctorId: doctorId}, 
                raw: true
            })
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join rooms r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Выбираем слоты по датам
    async getDoctorSlotsByDateTime (doctorId, startDateTime, endDateTime) {
        try {
            const startParsedDate = await DateTimeManager.getDateTimeWithTimezone(startDateTime, 3) //Заглушка, 3 - часовой пояс (+3 - мск), необходимо реализовать поиск по ip по таймзоне
            const endParsedDate = await DateTimeManager.getDateTimeWithTimezone(endDateTime, 3) //Заглушка, 3 - часовой пояс (+3 - мск), необходимо реализовать поиск по ip по таймзоне
            const slots = await database.models.Slots.findAll({
                where: {
                    doctorId: doctorId,
                    slotStartDateTime: {
                        [Op.gte]: startParsedDate
                    },
                    slotEndDateTime: {
                        [Op.lte]: endParsedDate
                    }
                },
                include: [{
                    model: database.models.Rooms,
                    required: false
                },
                {
                    model: database.models.Patients,
                    required: false
                }]
            });
            return slots;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Слот по id
    async getSlotById (slotId) {
        try {
            const slot = await database.models.Slots.findByPk(slotId, {
                    include: [
                    {
                        model: database.models.Rooms,
                        required: false
                    },
                    {
                        model: database.models.Patients,
                        required: false
                    }
                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Слот по id комнаты
    async getSlotByRoomId (roomId) {
        try {
            const room = await database.models.Rooms.findByPk(roomId);
            const slot = await database.models.Slots.findByPk(room.slotId, {
                include: [
                    {
                        model: database.models.Rooms,
                        required: false
                    },
                    {
                        model: database.models.Patients,
                        required: false
                    }
                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
        }
    }

    //Слот по названию комнаты
    async getSlotByRoomName (roomName) {
        try {
            const room =  await database.models.Rooms.findOne({
                where: {
                    roomName: roomName
                }
            })
            const slot = await database.models.Slots.findByPk(room.slotId, {
                include: [
                    {
                        model: database.models.Rooms,
                        required: false
                    },
                    {
                        model: database.models.Patients,
                        required: false
                    }
                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
        }
    }

    async getRoomById (roomId) {
        try {
            const room = await database.models.Rooms.findByPk(roomId);
            return room;
        }
        catch (e) {
            console.log(e)
        }
    }

    async createSlot (doctorId, patientId, startDateTime, duration) {
        try {
            const newSlot = await database.models.Slots.create({
                doctorId: doctorId, 
                slotStartDateTime: moment(new Date(startDateTime)).toDate(), 
                slotEndDateTime: moment(new Date(startDateTime)).add(duration, 'm').toDate(), 
                serviceId: 1, 
                isBusy: true, 
                patientId: patientId
            })
            return newSlot
        }
        catch (e) {
            console.log(e)
        }
    }

    async createRoom (slotId, roomName) {
        try {
            const slot = await database.models.Slots.findByPk(slotId)
            /* const roomName = await UserManager.translit(`${testDoctor.secondName}_${testPatient.secondName}_${testSlot.slotStartDateTime.getTime()}`)
        */
            const newRoom = await database.models.Rooms.create({roomName: roomName, meetingStart: slot.slotStartDateTime, slotId: slot.id})
            return newRoom
        }
        catch(e) {
            console.log(e)
        }
        

    }

    async createPayloadDoctor (doctorId, roomId) {
        try {
            const doctor = await database.models.Doctors.findByPk(doctorId, {include: [{
                model: database.models.Users,
                required: true
            }]})
            const room = await database.models.Rooms.findByPk(roomId)
            const slot = await database.models.Slots.findByPk(room.slotId)
            const payload = {
                aud: room.roomName, // аудитория (аудитория приложения, например jitsi)
                iss: JITSI_APP_ID, // издатель токена
                sub: JITSI_SERVER_URL, // цель токена (обычно URL сервера)
                room: room.roomName, // комната, к которой предоставляется доступ, используйте '*' для доступа ко всем комнатам
                nbf: moment(slot.slotStartDateTime).add(-20, 'm').unix(),
                exp: moment(slot.slotEndDateTime).add(20, 'm').unix(), // время истечения срока действия токена (например, через час)
                moderator: true, // установить true, если пользователь является модератором
                context: {
                    user: {
                        id: doctor.userId,
                        name: `${doctor.secondName} ${doctor.firstName}`, // имя пользователя
                        email: doctor.user.email, // email пользователя
                        avatar: doctor.user.avatar, // URL аватара пользователя (необязательно)
                    }
                }
            };
            return payload
        }
        catch (e) {
            console.log(e)
        }
    }

    async createPayloadPatient (patientId, roomId) {
        try {
            const patinet = await database.models.Patients.findByPk(patientId, {include: [{
                model: database.models.Users,
                required: true
            }]})
            const room = await database.models.Rooms.findByPk(roomId)
            const slot = await database.models.Slots.findByPk(room.slotId)
            const payload = {
                aud: room.roomName, // аудитория (аудитория приложения, например jitsi)
                iss: JITSI_APP_ID, // издатель токена
                sub: JITSI_SERVER_URL, // цель токена (обычно URL сервера)
                room: room.roomName, // комната, к которой предоставляется доступ, используйте '*' для доступа ко всем комнатам
                nbf: moment(slot.slotStartDateTime).add(-20, 'm').unix(),
                exp: moment(slot.slotEndDateTime).add(20, 'm').unix(), // время истечения срока действия токена (например, через час)
                moderator: false, // установить true, если пользователь является модератором
                context: {
                    user: {
                        id: patinet.userId,
                        name: `${patinet.secondName} ${patinet.firstName}`, // имя пользователя
                        email: patinet.user.email, // email пользователя
                        avatar: patinet.user.avatar, // URL аватара пользователя (необязательно)
                        
                    }
                }
            };
            return payload
        }
        catch (e) {
            console.log(e)
        }
    }
    
}

module.exports = new ConsultationService();