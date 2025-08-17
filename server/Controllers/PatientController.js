const PatientService = require("../Services/PatientService")
const ConsultationService = require("../Services/ConsultationService")
const DoctorService = require("../Services/DoctorService")
const UserManager = require('../Utils/UserManager')
const JITSI_SECRET = process.env.JITSI_SECRET;
const jwt = require('jsonwebtoken');
const UrlManager = require('../Utils/UrlManager')
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const MailManager = require("../Utils/MailManager");
class PatientController {
    async getConsultations (req, res) {
        try {
            /* const {userId} = req.query
            console.log(data)
            return res.status(200).json({data}) */
            const {userId} = req.query
            const patient = await PatientService.getPatientByUserId(userId)
            const activeSlots = await ConsultationService.getEndedPatientSlots(patient.id)

            res.status(200).json(activeSlots[0])
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        /* try {
            const {userId} = req.query
            const doctor = await DoctorService.getDoctorByUserId(userId)
            const activeSlots = await ConsultationService.getEndedDoctorSlots(doctor.id)
            res.status(200).json(activeSlots)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        } */
    }

    async getConsultationsByDoctorId(req, res) {
        try {
            const {doctorId} = req.query
            const doctor = await DoctorService.getDoctor(doctorId)
            const {date} = req.query
            let activeSlots = []
            if (!date) {
                activeSlots = await ConsultationService.getActiveDoctorSlots(doctor.id)
                
            }
            else {
                activeSlots = await ConsultationService.getActiveDoctorSlotsByDate(doctor.id, date)
            }
            res.status(200).json(activeSlots)
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        
    }

        async createConsultation(req, res) {
            try {
                const {doctorId, patientId, startDateTime, duration, slotStatusId } = req.body
                //console.log(doctorId, patientId, startDateTime, duration, slotStatusId)
                const doctor = await DoctorService.getDoctor(doctorId)
                const patient = await PatientService.getPatient(patientId)
                const newSlot = await ConsultationService.createSlot(doctor.id, patient.id, startDateTime, duration, slotStatusId)
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
                /* if (patient.User.phone) {
                    const date = new Date(startDateTime);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
            
                    const hours = String(date.getHours() + 3).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
            
                    const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
    
                    const data = smsCenterApi.sendSmsMessage(patient.User.phone, `Ссылка для подключения ${patientLink}. Консультация начнётся в ${formattedDateTime}`)
                    const dataWhatsApp = smsCenterApi.sendWhatsAppMessage(patient.User.phone, `Ссылка для подключения ${patientLink}. Консультация начнётся в ${formattedDateTime}`)
                    console.log(data)
                    console.log(dataWhatsApp)
                    const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime)
                    transporter.sendMail(mailOptionsPatinet, (error, info) => {
                        if (error) {
                            throw new Error(error)
                        }
                        console.log('Сообщение отправленно: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                } */
                /* if (doctor.User.phone) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(doctor.User.email, doctorLink, startDateTime)
                    transporter.sendMail(mailOptionsDoctor, (error, info) => {
                        if (error) {
                            throw new Error(error)
                        }
                        console.log('Сообщение отправленно: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                } */
                res.status(200).json({doctorShortUrl, patientShortUrl, newSlot, newRoom})
            }
            catch (e) {
                console.log(e)
                res.status(500).json(e.message)
            }
        }
    

    

}

module.exports = new PatientController()
