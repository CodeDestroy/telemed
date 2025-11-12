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
const PaymentService = require("../Services/PaymentService");
const yookassaApi = require('../Api/yookassaApi');
const SchedulerService = require("../Services/SchedulerService");
const PricesService = require("../Services/PricesService");
const FileService = require("../Services/FileService");

const moment = require('moment-timezone')
class PatientController {
    async getConsultations (req, res) {
        try {
            /* const {userId} = req.query
            console.log(data)
            return res.status(200).json({data}) */
            const {userId} = req.query
            const previous = (req.query.previous === 'true' ? true : false)
            const patient = await PatientService.getPatientByUserId(userId)
            if (previous){
                const activeSlots = await ConsultationService.getEndedPatientSlots(patient.id)
                res.status(200).json(activeSlots)
            }
            else {
                const activeSlots = await ConsultationService.getActivePatientSlots(patient.id)
                res.status(200).json(activeSlots)
            }
            
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
        let newSlot = null;
        let newPayment = null;
        let newRoom = null;
        let doctorShortUrl = null;
        let patientShortUrl = null;
        let yookassaPayment = null;
        try {
            const {doctorId, patientId, startDateTime, duration, slotStatusId, childId } = req.body
            //console.log(doctorId, patientId, startDateTime, duration, slotStatusId)
            const doctor = await DoctorService.getDoctor(doctorId)
            const patient = await PatientService.getPatient(patientId)

            // Разбираем дату-время на отдельно дату и время
            //const startDate = startDateTime.split('T')[0]; // yyyy-MM-dd
           // const startTime = startDateTime.split('T')[1]; // HH:mm:ss
            const startDate = new Date(startDateTime);

            // добавляем 3 часа
            startDate.setHours(startDate.getHours() + 3);

            // получаем только время HH:mm:ss
            const startTime = startDate.toISOString().split('T')[1].split('.')[0];
            //ищем schedule по startDateTime и doctorId
            const scheduleSlot = await SchedulerService.getDoctorScheduleByDateTime(doctor.id, startDate, startTime)

            newSlot = await ConsultationService.createSlot(doctor.id, patient.id, startDateTime, duration, slotStatusId)


            const price = await PricesService.getPricesByScheduleId(scheduleSlot.id)

            //Создаём платёж

            const dateObj = new Date(startDateTime);
            //dateObj.setHours(dateObj.getHours() + 3);

            const displayHours = String(dateObj.getHours()).padStart(2, '0');
            const displayMinutes = String(dateObj.getMinutes()).padStart(2, '0');
            const displaySeconds = String(dateObj.getSeconds()).padStart(2, '0');
            const displayTime = `${displayHours}:${displayMinutes}:${displaySeconds}`;

            const description = `Оплата ТМК на ${moment(startDate).format('DD.MM.YYYY')} ${displayTime}`
            newPayment = await PaymentService.createPayment(patient.userId, 3, price.price, newSlot.id, description)

            //Отправляем в юкассу
            if (!price.isFree) {
                yookassaPayment = await yookassaApi.createPayment({
                    amount: price.price,
                    description,
                    return_url: `https://dr.clinicode.ru/payments/${newPayment.uuid4}`,
                    payment_uuid: newPayment.uuid4,
                    customerEmail: patient.User.email,
                    customerPhone: patient.User.phone
                });

                if (yookassaPayment) {
                    newPayment.yookassa_id = yookassaPayment.id
                    newPayment.yookassa_status = yookassaPayment.status
                    //newPayment.yookassa_payment_method_type = yookassaPayment.payment_method.type
                    newPayment.yookassa_confirmation_url = yookassaPayment.confirmation.confirmation_url
                    
                }
            }
            else {
                newPayment.paymentStatusId = 3
            }
            await newPayment.save()
            const roomName = await UserManager.translit(`${doctor.secondName}_${patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
            newRoom = await ConsultationService.createRoom(newSlot.id, roomName, childId)
            const doctorPayload = await ConsultationService.createPayloadDoctor(doctor.id, newRoom.id)
            const patientPayload = await ConsultationService.createPayloadPatient(patient.id, newRoom.id)
            const tokenDoctor = jwt.sign(doctorPayload, JITSI_SECRET);
            const tokenPatient = jwt.sign(patientPayload, JITSI_SECRET);
            const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`
            const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`
            doctorShortUrl = await UrlManager.createShort(doctorUrl, doctor.User.id, newRoom.id)
            patientShortUrl = await UrlManager.createShort(patientUrl, patient.User.id, newRoom.id)
            const transporter = await MailManager.getTransporter()
            const patientLink =  SERVER_DOMAIN + 'short/' + patientShortUrl;
            const doctorLink =  SERVER_DOMAIN + 'short/' + doctorShortUrl;

            //Отключили отправку до оплаты
            if (price.isFree) {
                try {
                    if (patient.User.email) {
                        const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientUrl, startDateTime);
                        await transporter.sendMail(mailOptionsPatinet); // возвращает Promise, если без callback
                    }
                    if (doctor.User.email) {
                        const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(doctor.User.email, doctorUrl, newSlot.id, startDateTime);
                        await transporter.sendMail(mailOptionsDoctor);
                    }
                } catch (mailErr) {
                    // не откатываем транзакцию; логируем и сохраняем задачу на повтор
                    console.error('Ошибка отправки почты, создам задачу на retry', mailErr);
                }
            }


            /* if (patient.User.email) {
                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime)
                transporter.sendMail(mailOptionsPatinet, (error, info) => {
                    if (error) {
                        throw new Error(error)
                    }
                    console.log('Сообщение отправлено: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            }
            if (doctor.User.email) {
                const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(doctor.User.email, doctorLink, startDateTime)
                transporter.sendMail(mailOptionsDoctor, (error, info) => {
                    if (error) {
                        throw new Error(error)
                    }
                    console.log('Сообщение отправлено: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            } */
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
            res.status(200).json({doctorShortUrl, patientShortUrl, newSlot, newRoom, newPayment})
        }
        catch (e) {
            if (doctorShortUrl)
                doctorShortUrl.destroy();
            if (patientShortUrl)
                patientShortUrl.destroy();
            if (newRoom)
                newRoom.destroy();
            if (newPayment)
                newPayment.destroy();
            if (newSlot)
                newSlot.destroy();
            console.log(e)
            res.status(500).json(e.message)
        }
    }

    async getConsultationUrl (req, res) {
        try {
            const {slotId} = req.query
            const {userId} = req.query
            if (slotId) {
                const url = await ConsultationService.getUrlBySlotId(slotId, userId) 
                res.status(200).json(url)
            }
            else {
                throw new Error('slotId is required')
            }
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    }

    async getConsultationPrice (req, res) {
        try {
            const {doctorId, startDateTime} = req.body
            const startDate = new Date(startDateTime);

            // добавляем 3 часа
            startDate.setHours(startDate.getHours() + 3);

            // получаем только время HH:mm:ss
            const startTime = startDate.toISOString().split('T')[1].split('.')[0];
            const schedule = await SchedulerService.getDoctorScheduleByDateTime(doctorId, startDate, startTime)
            const price = await PricesService.getPricesByScheduleId(schedule.id)
            res.status(200).json(price)
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    }

    async uploadFile (req, res) {
       try {
            const { id } = req.params;
            const patientId = req.body.patientId;
            //const patientId = req.user?.personId; // если в req.user хранится пациент
            
            const file = req.file;
            const uploaded = await FileService.saveFile(file, id, patientId);
            return res.json(uploaded);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    }

    async getFiles(req, res) {
        try {
            const { id } = req.params;
            const files = await FileService.getFilesBySlot(id);
            res.json(files);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении файлов' });
        }
    }

    async getChildrenByPatientId(req, res) {
        try {
            const { id } = req.params;
            const children = await PatientService.getChildrenByPatientId(id);
            res.status(200).json(children)
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении детей' });
        }
    }

    async addChild(req, res) {
        try {
            const { child } = req.body;
            const newChild = await PatientService.addChild(child);
            res.status(200).json(newChild)
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при добавлении ребенка' });
        }
    }

    async removeChild(req, res) {
        try {
            const { id } = req.params;
            await PatientService.removeChild(id);
            res.status(200).json({ message: 'Ребенок успешно удален' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при удалении ребенка' });
        }
    }

    async downloadProtocol(req, res) {
        try {
            const { id } = req.params;
            const consultation = await ConsultationService.getSlotById(id);
            const protocolBuffer = await ConsultationService.generateProtocolPdf(consultation);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Protocol_${id}.pdf`);
            res.send(protocolBuffer);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при скачивании протокола' });
        }
    }
    

}

module.exports = new PatientController()
