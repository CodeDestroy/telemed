const healthyChildApi = require('../Api/healthyChildApi')
const UserService = require('../Services/user-service')
const ConsultationService = require('../Services/ConsultationService')
const UserManager = require('../Utils/UserManager')
const UrlManager = require('../Utils/UrlManager')
const MailManager = require('../Utils/MailManager')
const PatientService = require('../Services/PatientService')
const DoctorService = require('../Services/DoctorService')
const JITSI_SECRET = process.env.JITSI_SECRET;
const jwt = require('jsonwebtoken');
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const moment = require('moment-timezone')
class IntegrationController {
    async getOnlineSched (req, res) {
       /*  const data = await healthyChildApi.getOnlineSched()
        console.log(data)
        res.json(data) */
        const slots = [
            {
                "date": "04.10.2024",
                "empid": 1,
                "stime": "18:15",
                "etime": "18:50",
                "type": 1,
                "status": 1,
                "rqstid": 1, 
                "clid": null,
                "сlname": "", 
                "srvs": 
                [
                    {
                        "srvid": 1, 
                        "srvname": "Телемедицинская консультация" 
                    }
                ],
                "empfio": "Тестов Тест Тестович" 
            
            },
            {
                "date": "07.10.2024",
                "empid": 1,
                "stime": "11:00",
                "etime": "12:00",
                "type": 1,
                "status": 1,
                "rqstid": 1, 
                "clid": null,
                "сlname": "", 
                "srvs": 
                [
                    {
                        "srvid": 1, 
                        "srvname": "Телемедицинская консультация" 
                    }
                ],
                "empfio": "Тестов Тест Тестович" 
            
            },
            {
                "date": "07.10.2024",
                "empid": 1,
                "stime": "18:15",
                "etime": "18:50",
                "type": 1,
                "status": 1,
                "rqstid": 1, 
                "clid": null,
                "сlname": "", 
                "srvs": 
                [
                    {
                        "srvid": 1, 
                        "srvname": "Телемедицинская консультация" 
                    }
                ],
                "empfio": "Тестов Тест Тестович" 
            
            },
            {
                "date": "08.10.2024",
                "empid": 1,
                "stime": "18:15",
                "etime": "18:50",
                "type": 1,
                "status": 1,
                "rqstid": 1, 
                "clid": null,
                "сlname": "", 
                "srvs": 
                [
                    {
                        "srvid": 1, 
                        "srvname": "Телемедицинская консультация" 
                    }
                ],
                "empfio": "Тестов Тест Тестович" 
            
            }
        ]
        const groupedSlots = slots.reduce((acc, slot) => {
            const date = slot.date;
        
            // Если дата уже есть в аккумуляторе, добавляем слот в существующий массив
            if (!acc[date]) {
                acc[date] = [];
            }
        
            acc[date].push(slot);
            return acc;
        }, {});
        
        // Преобразуем результат в массив
        const groupedSlotsArray = Object.keys(groupedSlots).map(date => ({
            date,
            slots: groupedSlots[date]
        }));
        console.log(groupedSlotsArray)
        res.json(groupedSlotsArray)
    }

    async setOnlineRequestPaid (req, res) {
        try {
            console.log(req.body)
            const {fullname, parentName, birthdate, email, phone, selected_slot, snils} = req.body
            /* return res.status(500).json("Тест") */
            /* const regex = /^(\d{2}\.\d{2}\.\d{4}) (\d{2}:\d{2})-(\d{2}:\d{2}) (.+)$/;
            const match = selected_slot.match(regex); */

            if (selected_slot) {
                /* const date = match[1]; // Дата
                const startTime = match[2]; // Время начала
                const endTime = match[3]; // Время конца
                const doctorFIO = match[4]; // ФИО врача */

                // Разделяем строку на две части: до времени начала ФИО и после
                const firstSpace = selected_slot.indexOf(' '); // Индекс первого пробела (после даты)
                const lastDash = selected_slot.lastIndexOf('-'); // Индекс последнего тире (между временем начала и временем конца)

                // Извлекаем дату
                const date = selected_slot.substr(0, firstSpace);

                // Извлекаем время начала
                const startTime = selected_slot.substr(firstSpace + 1, lastDash - firstSpace - 1);

                // Находим следующий пробел после времени конца
                const endTimeStart = lastDash + 1;
                const endTimeEnd = selected_slot.indexOf(' ', endTimeStart);
                const endTime = selected_slot.substring(endTimeStart, endTimeEnd);

                // Извлекаем ФИО
                const doctorFIO = selected_slot.substr(endTimeEnd + 1);

                const [day, month, year] = date.split('.'); // Разделяем дату
                const startDateTime = new Date(`${year}-${month}-${day}T${startTime}`)

                // Создаем переменную slotEndDateTime
                const slotEndDateTime = new Date(`${year}-${month}-${day}T${endTime}`); // Время конца

                // Вычисляем длительность в миллисекундах
                const durationMs = slotEndDateTime - startDateTime;
                const duration = durationMs / (1000 * 60); // Конвертируем миллисекунды в минуты

                const {secondName , firstName, patronomicName} = await UserManager.parseFullName(doctorFIO)
                /* console.log('Дата:', date);
                console.log('Время начала:', startTime);
                console.log('Время конца:', endTime);
                console.log('ФИО врача:', {secondName , firstName, patronomicName}); */
                const doctors = await DoctorService.getDoctorsByFIO(secondName, firstName, patronomicName)
                const doctor = doctors[0]
                if (!doctor) {
                    console.log('Доктор не найден в системе. Обратитесь в поддержку.')
                    throw new Error('Доктор не найден в системе. Обратитесь в поддержку.')
                }
                /* console.log(doctor) */
                let candidate = await UserService.checkPhone(phone)
                /* const newSlot = await ConsultationService.createSlot(doctor.id, patient.id, startDateTime, duration) */
                if (!candidate) {
                    const {secondName, firstName, patronomicName} = await UserManager.parseFullName(fullname)
                    const formattedDate = moment(birthdate, "DD.MM.YYYY").format('YYYY-MM-DD');

                    console.log(formattedDate)
                    const password = Math.random().toString(36).slice(-8)
                    /* const avatar = req.file; */
                    /* return res.json(avatar) */
                    const info = `Законный представитель ${parentName}`
                    const newUser = await UserService.createUser(3, phone, password, null ,email, phone)
                    const newPatient = await PatientService.createPatient(newUser.id, secondName, firstName, patronomicName, formattedDate, info, snils)
                    candidate = await UserService.checkPhone(phone)
                }
                const newSlot = await ConsultationService.createSlot(doctor.id, candidate.patient.id, startDateTime, duration)    
                const roomName = await UserManager.translit(`${doctor.secondName}_${candidate.patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
                const newRoom = await ConsultationService.createRoom(newSlot.id, roomName)
                const doctorPayload = await ConsultationService.createPayloadDoctor(doctor.id, newRoom.id)
                const patientPayload = await ConsultationService.createPayloadPatient(candidate.patient.id, newRoom.id)
                const tokenDoctor = jwt.sign(doctorPayload, JITSI_SECRET);
                const tokenPatient = jwt.sign(patientPayload, JITSI_SECRET);
                const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`
                const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`
                const doctorShortUrl = await UrlManager.createShort(doctorUrl, doctor.user.id, newRoom.id)
                const patientShortUrl = await UrlManager.createShort(patientUrl, candidate.id, newRoom.id)
                const transporter = await MailManager.getTransporter()
                const patientLink =  SERVER_DOMAIN + 'short/' + patientShortUrl;
                const doctorLink =  SERVER_DOMAIN + 'short/' + doctorShortUrl;
                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(candidate.email, patientLink)
                transporter.sendMail(mailOptionsPatinet, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Сообщение отправленно: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
                const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(doctor.user.email, doctorLink)
                transporter.sendMail(mailOptionsDoctor, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Сообщение отправленно: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
                res.status(200).json({patientShortUrl, newSlot, newRoom})
            } else {
                console.log('Неверный формат слота')
                throw new Error('Неверный формат слота')
            }
            /* console.log(req.body) */
            

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async createConsultation(req, res) {
        try {
            const {doctor, patient, startDateTime, duration } = req.body
            /* console.log(patient.user) */
            /* return res.json(patient.user) */
            const newSlot = await ConsultationService.createSlot(doctor.id, patient.id, startDateTime, duration)
            const roomName = await UserManager.translit(`${doctor.secondName}_${patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
            const newRoom = await ConsultationService.createRoom(newSlot.id, roomName)
            const doctorPayload = await ConsultationService.createPayloadDoctor(doctor.id, newRoom.id)
            const patientPayload = await ConsultationService.createPayloadPatient(patient.id, newRoom.id)
            const tokenDoctor = jwt.sign(doctorPayload, JITSI_SECRET);
            const tokenPatient = jwt.sign(patientPayload, JITSI_SECRET);
            console.log(CLIENT_URL)
            const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`
            const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`
            const doctorShortUrl = await UrlManager.createShort(doctorUrl, doctor.user.id, newRoom.id)
            const patientShortUrl = await UrlManager.createShort(patientUrl, patient.user.id, newRoom.id)
            const transporter = await MailManager.getTransporter()
            const patientLink =  SERVER_DOMAIN + 'short/' + patientShortUrl;
            const doctorLink =  SERVER_DOMAIN + 'short/' + doctorShortUrl;
            const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.user.email, patientLink)
            transporter.sendMail(mailOptionsPatinet, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Сообщение отправленно: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(doctor.user.email, doctorLink)
            transporter.sendMail(mailOptionsDoctor, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Сообщение отправленно: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            res.status(200).json({doctorShortUrl, patientShortUrl, newSlot, newRoom})
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }

}

module.exports = new IntegrationController()
