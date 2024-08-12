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

class AdminController {
    async getAllConsultations(req, res) {
        try {


            const allSlots = await ConsultationService.getAllSlots()
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
            const allDoctors = await DoctorService.getAllDoctors()
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

    async createPatient (req, res) {
        try {
            const {
                secondName,
                name,
                patrinomicName,
                phone,
                email,
                password,
                birthDate,
                info
            } = req.body;
            const formattedDate = moment(birthDate).format('YYYY-MM-DD');
            const avatar = req.file;
            /* return res.json(avatar) */
            const newUser = await userService.createUser(3, phone, password, SERVER_DOMAIN + 'uploads/' + avatar.filename, email, phone)
            const newPatient = await PatientService.createPatient(newUser.id, secondName, name, patrinomicName, formattedDate, info)

            res.status(201).json({ message: 'Пациент создан успешно', userId: newUser.id, patientId: newPatient.id });
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new AdminController();