/* const database = require('../models/index'); */
const database = require('../Database/setDatabase')
const DateTimeManager = require('../Utils/DateTimeManager')
const moment = require('moment-timezone');
const { raw } = require('body-parser');
const UrlManager = require('../Utils/UrlManager');
const { Op } = require('sequelize');
const fs = require('fs')
const path = require('path')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const FileManager = require('../Utils/FilesManager')
const JITSI_APP_ID = process.env.JITSI_APP_ID;
const JITSI_SERVER_URL = process.env.JITSI_SERVER_URL;
class ConsultationService {


    async getAllSlotsByDate (date) {
        try {
            console.log(date)
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
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and DATE(s."slotStartDateTime") = :date`, 
                    
            {
                raw: false,
                replacements: { date }
            })
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    //Все слоты (лучше не использовать)
    async getAllSlots () {
        try {
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
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
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
            throw e
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

            if (user.Admin.medOrgId) {
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
                    from "Slots" s 
                    left join "Rooms" r  on s.id = r."slotId" 
                    left join "Patients" p on p.id  = s."patientId" 
                    join "Doctors" d on d.id = s."doctorId" 
                    join "Urls" url on url."userId" = d."userId" 
                    join "Urls" url2 on url2."userId" = p."userId" 
                    join "SlotStatuses" sst on sst.id = s."slotStatusId"
                    where 
                        d."medOrgId" = ${user.Admin.medOrgId} and
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
            throw e
        }   
    }

    async getAllSlotsInMOByAdminId (adminId) {
        try {
            const admin = await database.models.Admins.findByPk(adminId)

            if (admin.medOrgId) {
                const slots = await database.sequelize.query(`
                    select s.id as "id" , s.id as "slot_id", 
                    p."firstName" as "pFirstName",  
                        p."firstName" as "pFirstName", 
                        p."secondName" as "pSecondName", 
                        p."patronomicName" as "pPatronomicName", 
                        d."firstName" as "dFirstName", 
                        d."secondName" as "dSecondName", 
                        d."patronomicName" as "dPatronomicName", 
                        url."shortUrl" as "dUrl", 
                        url2."shortUrl" as "pUrl", *
                    from "Slots" s 
                    left join "Rooms" r  on s.id = r."slotId" 
                    left join "Patients" p on p.id  = s."patientId" 
                    join "Doctors" d on d.id = s."doctorId" 
                    join "Urls" url on url."userId" = d."userId" 
                    join "Urls" url2 on url2."userId" = p."userId" 
                    join "SlotStatuses" sst on sst.id = s."slotStatusId"
                    where 
                        d."medOrgId" = ${admin.medOrgId} and
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
            throw e
        }   
    }

    async getAllDoctorSlotsRaw(doctorId) {
        try {
            /* const slots = await database["Slots.findAll({
                include: [{
                    model: database["Rooms,
                    required: false
                },
                {
                    model: database["Patients,
                    required: false
                }]
            }); */
            const slots = await database.sequelize.query(`
                select s.id as "id" , s.id as "slot_id", 
                    p."firstName" as "pFirstName",  
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
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
            throw e
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
            throw e
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
            throw e
        }
    }



    async getEndedDoctorSlots (doctorId) {
        try {
            const currTime = new Date().toISOString();
                        
            const slots = await database.sequelize.query(`
                select s.id as "id" , s.id as "slot_id", 
                    p."firstName" as "pFirstName",  s.id as "slot_id", 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", 
                    pmt."payTypeId" as "payTypeId", pmt."yookassa_status" as "yookassa_status", pmt.id as "pmt_id",
                    pmtst."code" as "paymentStatusCode", pmtst."description" as "paymentStatusDescription", pmtst.id as "pmtst_id", p.id as "patient_id", d.id as "doctor_id", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                left join "Payments" pmt on pmt."slotId" = s.id
                left join "PaymentStatuses" pmtst on pmtst.id = pmt."paymentStatusId"
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
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join "Rooms" r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getEndedPatientSlots (patientId) {
        try {
            const currTime = new Date().toISOString();
                        
            /* const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    post."postName" as "postName",
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", usr."avatar" as "avatar", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Users" usr on usr.id = d."userId"
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                join "Posts" post on post.id = d."postId"
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."patientId" = :patientId 
                    and (r."ended" = true) 
                    and (s."slotStartDateTime" < :currTime or s."slotStatusId" = 4)`, 
            {
                replacements: { patientId: patientId, currTime: currTime }, 
                raw: true
            }) */
            const slots = await database.models.Slots.findAll({
                where: {
                    patientId,
                },
                include: [
                    {
                        model: database.models.Rooms,
                        where: { ended: true },
                        required: true
                    },
                    {
                        model: database.models.Patients,
                        /* as: 'Patient',
                        attributes: ['firstName', 'secondName', 'patronomicName'], */
                        include: [{ 
                            model: database.models.Users,
                                include: [{
                                    model: database.models.Url,
                                    where: { type: 'room' },
                                    required: false
                                }]
                        }]
                    },
                    {
                        model: database.models.Doctors,
                        include: [
                            { 
                                model: database.models.Users,
                                include: [{
                                    model: database.models.Url,
                                    where: { type: 'room' },
                                    required: false
                                }]
                            },
                            { 
                                model: database.models.Posts,
                                required: false
                            },
                        ]
                    }
                ],
                order: [['slotStartDateTime', 'DESC']]
            });
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join "Rooms" r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    //Возвращаем все акуальные слоты по врачу
    async getActiveDoctorSlots(doctorId) {
        try {
            const currTime = new Date().toISOString();
                        
            const slots = await database.sequelize.query(`
                select s.id as "id" , s.id as "slot_id", 
                    p."firstName" as "pFirstName",  
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl",
                    pmt."payTypeId" as "payTypeId", pmt."yookassa_status" as "yookassa_status", pmt.id as "pmt_id",
                    pmtst."code" as "paymentStatusCode", pmtst."description" as "paymentStatusDescription", pmtst.id as "pmtst_id", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                left join "Payments" pmt on pmt."slotId" = s.id
                left join "PaymentStatuses" pmtst on pmtst.id = pmt."paymentStatusId"
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."doctorId" = :doctorId 
                    and (r."ended" != true or r."ended" is null) `, 
            {
                replacements: { doctorId: doctorId}, 
                raw: true
            })
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join "Rooms" r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getActivePatientSlots(patientId) {
        try {
            const currTime = new Date().toISOString();
                        
            /* const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    post."postName" as "postName",
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", usr."avatar" as "avatar", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Users" usr on usr.id = d."userId"
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                join "Posts" post on post.id = d."postId"
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."patientId" = :patientId 
                    and ((r."ended" != true or r."ended" is null) and (s."slotStatusId" != 4 or s."slotStatusId" != 5)) `, 
            {
                replacements: { patientId: patientId}, 
                raw: true
            }) */
                        
            /* const slots = await database.sequelize.query(`
                select s.id as "id" , 
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    post."postName" as "postName",
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl", usr."avatar" as "avatar", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Users" usr on usr.id = d."userId"
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                join "Posts" post on post.id = d."postId"
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."patientId" = :patientId 
                    and (r."ended" != true or r."ended" is null)
                    and s."slotStatusId" NOT IN (4, 5)`, 
            {
                replacements: { patientId: patientId, currTime: currTime }, 
                raw: true
            }) */
            const slots = await database.models.Slots.findAll({
                where: { patientId },
                include: [
                    {
                        model: database.models.Rooms,
                        required: true,
                        where: {
                            [Op.or]: [
                                { ended: false },
                                { ended: null }
                            ]
                        }
                    },
                    {
                        model: database.models.Patients,
                        include: [{ 
                            model: database.models.Users,
                                include: [{
                                    model: database.models.Url,
                                    where: { type: 'room' },
                                    required: false
                                }]
                        }]
                    },
                    {
                        model: database.models.Doctors,
                        include: [
                            {   model: database.models.Users,
                                include: [{
                                    model: database.models.Url,
                                    where: { type: 'room' },
                                    required: false
                                }]
                            },
                            { 
                                model: database.models.Posts,
                                through: { attributes: [] }
                            }
                        ]
                    },
                    {
                        model: database.models.Payments,
                        required: false,
                        include: [
                            { model: database.models.PaymentStatus }
                        ]
                    }
                ],
                order: [['slotStartDateTime', 'ASC']]
            });
            /* const slots = await database.sequelize.query(`SELECT * FROM slots s join "Rooms" r on s.id = r."slotId" where s."doctorId" = ${doctorId}`, {raw: false}) */
            /* console.log(slots) */
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    //Возвращаем все акуальные слоты по врачу
    async getActiveDoctorSlotsByDate(doctorId, date) {
        try {
            const currTime = (new Date(date).toISOString()).substring(0, 10);
            const slots = await database.sequelize.query(`
                select s.id as "id" , s.id as "slot_id", 
                    p."firstName" as "pFirstName",  
                    p."firstName" as "pFirstName", 
                    p."secondName" as "pSecondName", 
                    p."patronomicName" as "pPatronomicName", 
                    d."firstName" as "dFirstName", 
                    d."secondName" as "dSecondName", 
                    d."patronomicName" as "dPatronomicName", 
                    url."shortUrl" as "dUrl", 
                    url2."shortUrl" as "pUrl",
                    pmt."payTypeId" as "payTypeId", pmt."yookassa_status" as "yookassa_status", pmt.id as "pmt_id",
                    pmtst."code" as "paymentStatusCode", pmtst."description" as "paymentStatusDescription", pmtst.id as "pmtst_id", *
                from "Slots" s 
                left join "Rooms" r  on s.id = r."slotId" 
                left join "Patients" p on p.id  = s."patientId" 
                join "Doctors" d on d.id = s."doctorId" 
                join "Urls" url on url."userId" = d."userId" 
                join "Urls" url2 on url2."userId" = p."userId" 
                left join "Payments" pmt on pmt."slotId" = s.id
                left join "PaymentStatuses" pmtst on pmtst.id = pmt."paymentStatusId"
                where 
                    url2."roomId" = r.id 
                    and url."roomId" = r.id 
                    and s."doctorId" = :doctorId 
                    and s."slotStartDateTime"::date = :date
                    and (r."ended" != true or r."ended" is null) `, 
            {
                replacements: { doctorId: doctorId, date: currTime}, 
                raw: true
            })
            return slots;
        }
        catch (e) {
            console.log(e)
            throw e
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
            throw e
        }
    }

    //Слот по id
    async getSlotById (slotId) {
        try { 
            const slot = await database.models.Slots.findByPk(slotId, {
                    include: [
                    {
                        model: database.models.Rooms,
                        required: false,
                        include: [
                            {
                                model: database.models.Url,
                                required: true
                            },
                            {
                                model: database.models.Child,
                                required: false
                            }
                        ]

                    },
                    {
                        model: database.models.Patients,
                        required: false
                    },
                    {
                        model: database.models.Attachments,
                        required: false
                    },
                    {
                        model: database.models.Doctors,
                        required: false,
                        include: [
                            {
                                model: database.models.Posts,
                                required: true
                            },
                            {
                                model: database.models.Users,
                                required: true
                            }
                        ]
                    },
                    {
                        model: database.models.Payments,
                        required: false,
                        include: [
                            {
                                model: database.models.PaymentStatus,
                                required: true
                            },
                            {
                                model: database.models.PayTypes,
                                required: true
                            }
                        ]
                    }

                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getUrlBySlotId (slotId, userId) {
        try {
            const url = await UrlManager.getUrlBySlotId(slotId, userId)
            return url
        }
        catch (e) {
            console.log(e)
            throw e
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
                        required: false,
                        include: [
                            {
                                model: database.models.Users,
                                required: false
                            }
                        ]
                    }
                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
            throw e
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
                        required: false,
                        include: [
                            {
                                model: database.models.Users,
                                required: false
                            }
                        ]
                    }
                ]
            });
            return slot;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getRoomById (roomId) {
        try {
            const room = await database.models.Rooms.findByPk(roomId);
            return room;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorBySlotId (slotId) {
        try {
            const slot = await database.models.Slots.findByPk(slotId, {
                include: [
                    {
                        model: database.models.Doctors,
                        required: false,
                    }
                ]
            })
            return slot.Doctor
        }
        catch (e)
        {
            throw e
        }
    }

    async getPatientBySlotId (slotId) {
        try {
            const slot = await database.models.Slots.findByPk(slotId, {
                include: [
                    {
                        model: database.models.Patients,
                        required: false,
                    }
                ]
            })
            return slot.Doctor
        }
        catch (e)
        {
            throw e
        }
    }

    async createSlot (doctorId, patientId, startDateTime, duration, slotStatusId = null) {
        try {
            const newSlot = await database.models.Slots.create({
                doctorId: doctorId, 
                slotStartDateTime: moment(new Date(startDateTime)).toDate(), 
                slotEndDateTime: moment(new Date(startDateTime)).add(duration, 'm').toDate(), 
                slotStatusId: slotStatusId == 1 ? 2 : slotStatusId,
                serviceId: 1, 
                isBusy: true, 
                patientId: patientId
            })
            return newSlot
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async updateSlot(slotId, doctorId, patientId, startDateTime, duration, slotStatusId = null) {
        try {
            const slot = await database.models.Slots.findByPk(slotId);
            if (!slot) {
                throw new Error(`Слот с ID ${slotId} не найден`);
            }
            slot.doctorId = doctorId;
            slot.patientId = patientId;
            slot.slotStartDateTime = moment(new Date(startDateTime)).toDate();
            slot.slotEndDateTime = moment(new Date(startDateTime)).add(duration, 'm').toDate();
            slot.slotStatusId = slotStatusId == 1 ? 2 : slotStatusId;
            slot.isBusy = true;

            await slot.save();

            return slot;
        } catch (e) {
            console.error('Ошибка при обновлении слота:', e);
            throw e;
        }
    }



    async createRoom (slotId, roomName, childId = null) {
        try {
            const slot = await database.models.Slots.findByPk(slotId)
            /* const roomName = await UserManager.translit(`${testDoctor.secondName}_${testPatient.secondName}_${testSlot.slotStartDateTime.getTime()}`)
        */
            const newRoom = await database.models.Rooms.create({roomName: roomName, meetingStart: slot.slotStartDateTime, slotId: slot.id, childId: childId})
            return newRoom
        }
        catch(e) {
            console.log(e)
            throw e
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
                nbf: moment(slot.slotStartDateTime).add(-2, 'd').unix(),
                exp: moment(slot.slotEndDateTime).add(2, 'h').unix(), // время истечения срока действия токена (например, через час)
                moderator: true, // установить true, если пользователь является модератором
                context: {
                    user: {
                        id: doctor.userId,
                        name: `${doctor.secondName} ${doctor.firstName}`, // имя пользователя
                        email: doctor.User?.email, // email пользователя
                        avatar: doctor.User.avatar, // URL аватара пользователя (необязательно)
                    }
                }
            };
            return payload
        }
        catch (e) {
            console.log(e)
            throw e
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
                nbf: moment(slot.slotStartDateTime).add(-2, 'd').unix(),
                exp: moment(slot.slotEndDateTime).add(2, 'h').unix(), // время истечения срока действия токена (например, через час)
                moderator: false, // установить true, если пользователь является модератором
                context: {
                    user: {
                        id: patinet.userId,
                        name: `${patinet.secondName} ${patinet.firstName}`, // имя пользователя
                        email: patinet.User?.email, // email пользователя
                        avatar: patinet.User?.avatar, // URL аватара пользователя (необязательно)
                        
                    }
                }
            };
            return payload
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getSlotStatuses() {
        try {
            const statuses = await database.models.SlotStatus.findAll(); 
            return statuses;
        }
        catch (e) {

            console.log(e)
            throw e
            
        }
    }
    

    async generateProtocolPdf(consultation) {
        try {
            // 1. Загружаем шаблон
            const templatePath = path.resolve(__dirname, '../public/templates/protocol_template.docx');
            const content = fs.readFileSync(templatePath, 'binary');

            // 2. Готовим шаблон docx
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            // 3. Подготавливаем данные для подстановки
            const data = {
                DoctorFIO: consultation.Doctor
                    ? `${consultation.Doctor.secondName} ${consultation.Doctor.firstName} ${consultation.Doctor.patronomicName || ''}`
                    : '',
                DoctorSpetiality: consultation.Doctor?.Posts?.map(p => p.postName).join(', ') || '',
                DateTime: consultation.slotStartDateTime
                    ? new Date(consultation.slotStartDateTime).toLocaleString('ru-RU')
                    : '',
                PatientFIO: consultation.Room?.Child
                    ? `${consultation.Room.Child.lastName} ${consultation.Room.Child.firstName} ${consultation.Room.Child.patronymicName || ''} ${new Date(consultation.Room.Child.birthDate).toLocaleDateString('ru-RU')}`
                    : '',
                Recommendations: consultation.Room?.protocol || '',
            };

            // 4. Рендерим шаблон
            try {
                doc.render(data);
            } catch (err) {
                console.error('Ошибка при рендеринге шаблона:', err);
                throw err;
            }

            // 5. Получаем буфер DOCX
            const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
            if (!docxBuffer || docxBuffer.length === 0) {
                throw new Error('❌ Получен пустой docxBuffer — проверь шаблон.');
            }

            // 6. Конвертируем в PDF через FileManager
            const pdfBuffer = await FileManager.convertDocxToPdf(docxBuffer);

            // 7. Возвращаем PDF
            return pdfBuffer;
        } catch (e) {
            console.error('Ошибка в generateProtocolPdf:', e);
            throw e;
        }
    }

    
}

module.exports = new ConsultationService();