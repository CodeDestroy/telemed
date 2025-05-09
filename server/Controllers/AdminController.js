const DoctorService = require('../Services/DoctorService')
const ConsultationService = require('../Services/ConsultationService')
const PatientService = require('../Services/PatientService')
const userService = require('../Services/user-service')
const moment = require('moment-timezone')
const UserManager = require('../Utils/UserManager')
const JITSI_SECRET = process.env.JITSI_SECRET;
const jwt = require('jsonwebtoken');
const UrlManager = require('../Utils/UrlManager')
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const MailManager = require("../Utils/MailManager");
const MedicalOrgService = require('../Services/MedicalOrgService')
const ApiError = require('../Errors/api-error')
var validator = require("email-validator");

class AdminController {
    async getAllConsultations(req, res) {
        try {
            let allSlots = []
            if (req.user.accessLevel === 4) {
                allSlots = await ConsultationService.getAllSlots()
            }
            else if (req.user.accessLevel === 3 || req.user.accessLevel === 5) {
                allSlots = await ConsultationService.getAllSlotsInMO(req.user.id)
            }
            else if (req.user.accessLevel === 2) {
                allSlots = await ConsultationService.getAllDoctorSlotsRaw(req.user.personId)
            }
            else if (req.user.accessLevel === 1) {
                //Все слоты пациента
            }
            
            res.status(200).json(allSlots)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
        
    }

    async getEndedConsultations (req, res) {
        try {
            const {userId} = req.query
            /* const doctor = await DoctorService.getDoctorByUserId(userId)
            const activeSlots = await ConsultationService.getEndedDoctorSlots(doctor.id) */
            res.status(200).json(userId)
        }
        catch (e) {
            res.status(404).json({error: e.message})
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
            const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`
            const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`
            const doctorShortUrl = await UrlManager.createShort(doctorUrl, doctor.User.id, newRoom.id)
            const patientShortUrl = await UrlManager.createShort(patientUrl, patient.User.id, newRoom.id)
            const transporter = await MailManager.getTransporter()
            const patientLink =  SERVER_DOMAIN + 'short/' + patientShortUrl;
            const doctorLink =  SERVER_DOMAIN + 'short/' + doctorShortUrl;
            if (patient.User.email) {
                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime)
                transporter.sendMail(mailOptionsPatinet, (error, info) => {
                    if (error) {
                        throw new Error(error)
                        /* return console.log(error); */
                    }
                    console.log('Сообщение отправленно: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            }
            if (doctor.User.email) {
                const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(doctor.User.email, doctorLink, startDateTime)
                transporter.sendMail(mailOptionsDoctor, (error, info) => {
                    if (error) {
                        throw new Error(error)
                    }
                    console.log('Сообщение отправленно: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            }
            res.status(200).json({doctorShortUrl, patientShortUrl, newSlot, newRoom})
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getAllPatients (req, res) {
        try {
            const allPatients = await PatientService.getAllPatients()
            res.status(200).json(allPatients)
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async getPatient (req, res) {
        try {
            const id = req.params.id
            const patient = await PatientService.getPatient(id)
            res.status(200).json(patient)
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async getAllDoctors (req, res) {
        try {
            let allDoctors = []
            if (req.user.accessLevel == 4) {
                allDoctors = await DoctorService.getAllDoctors()
            }
            else if (req.user.accessLevel == 3 || req.user.accessLevel == 5) {
                const medOrg = await MedicalOrgService.getMedOrgByUserId(req.user.id)
                if (!medOrg) {
                    throw ApiError.BadRequest('Ошибка определения медицинской организации. Обратитесь в поддержку.')
                }
                allDoctors = await DoctorService.getAllDoctorsInMO(medOrg.id)
            }
            else {
                throw ApiError.AuthError('Недостаточно прав для выполнения данной операции.')
            }
            res.status(200).json(allDoctors)
            
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async getDoctor (req, res) {
        try {
            const id = req.params.id
            const doctor = await DoctorService.getDoctor(id);
            res.status(200).json(doctor)
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async editDoctor (req, res) {
        try {
            const id = req.params.id
            const {user} = req.body
            const doctor = await DoctorService.getDoctor(id);
            doctor.secondName = user.secondName
            doctor.firstName = user.firstName
            doctor.patronomicName = user.patronomicName
            doctor.snils = user.snils
            doctor.User.email = user.User.email
            doctor.User.confirmed = user.User.confirmed
            doctor.User.phone = user.User.phone
            doctor.save()
            doctor.User.save()
            res.status(200).json(doctor)
            
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async editPatient (req, res) {
        try {
            const id = req.params.id
            const {user} = req.body
            const patient = await PatientService.getPatient(id);
            patient.secondName = user.secondName
            patient.firstName = user.firstName
            patient.patronomicName = user.patronomicName
            patient.snils = user.snils
            patient.User.email = user.User.email
            patient.User.confirmed = user.User.confirmed
            patient.User.phone = user.User.phone
            patient.save()
            patient.User.save()
            res.status(200).json(patient)
            
        }
        catch (e) {
            res.status(404).json(e.message)
        }
    }

    async createDoctor (req, res) {
        try {
            const {
                secondName,
                name,
                patrinomicName,
                phone,
                email,
                password,
                birthDate,
                info,
                inn,
                snils
            } = req.body;
            const formattedDate = moment(birthDate).format('YYYY-MM-DD');
            const avatar = req.file;
            let errors = ''
            if (secondName?.length == 0)
                errors = errors + 'Фамилия не может быть пустой\n'
            if (name?.length == 0)
                errors = errors + 'Имя не может быть пустым\n'
            if (phone?.length < 9)
                errors = errors + 'Неверный номер телефона\n'
            if (!validator.validate(email))
                errors = errors + 'Неверный email\n'
            if (birthDate?.length < 10)
                errors = errors + 'Неверная дата\n'
            if (errors.length > 0) 
                throw ApiError.BadRequest(errors)

            if (req.user.accessLevel == 4) {
                const newUser = await userService.createUser(2, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
                const newDoctor = await DoctorService.createDoctor(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils)

                return res.status(201).json({ message: 'Врач создан успешно', userId: newUser.id, doctorId: newDoctor.id });
            }
            else if (req.user.accessLevel == 3) {
                const medOrg = await MedicalOrgService.getMedOrgByUserId(req.user.id)
                if (!medOrg) {
                    throw ApiError.BadRequest('Ошибка определения медицинской организации. Обратитесь в поддержку.')
                }
                const newUser = await userService.createUser(2, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
                const newDoctor = await DoctorService.createDoctor(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils, medOrg.id)

                return res.status(201).json({ message: 'Врач создан успешно', userId: newUser.id, doctorId: newDoctor.id });
            }
            else {
                throw ApiError.AuthError('Недостаточно прав для выполнения данной операции.')
            }
            
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }

    async createPatient (req, res) {
        try {
            const {
                secondName,
                name,
                patrinomicName,
                phone,
                snils,
                email,
                password,
                birthDate,
                info
            } = req.body;
            let errors = ''
            if (secondName?.length == 0)
                errors = errors + 'Фамилия не может быть пустой\n'
            if (name?.length == 0)
                errors = errors + 'Имя не может быть пустым\n'
            if (phone?.length < 9)
                errors = errors + 'Неверный номер телефона\n'
            if (!validator.validate(email))
                errors = errors + 'Неверный email\n'
            if (birthDate?.length < 10)
                errors = errors + 'Неверная дата рождения\n'
            if (errors.length > 0) 
                throw ApiError.BadRequest(errors)
            const formattedDate = moment(birthDate).format('YYYY-MM-DD');
            const avatar = req.file;
            
            const newUser = await userService.createUser(1, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
            const newPatient = await PatientService.createPatient(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils)

            res.status(201).json({ message: 'Пациент создан успешно', userId: newUser.id, patientId: newPatient.id });
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new AdminController();