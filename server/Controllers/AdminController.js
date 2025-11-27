const DoctorService = require('../Services/DoctorService')
const ConsultationService = require('../Services/ConsultationService')
const PatientService = require('../Services/PatientService')
const userService = require('../Services/user-service')
const moment = require('moment-timezone')
const database = require('../Database/setDatabase')
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
const smsCenterApi = require('../Api/smsCenterApi')
const PaymentService = require("../Services/PaymentService");
const yookassaApi = require('../Api/yookassaApi');
const SchedulerService = require('../Services/SchedulerService')
const PricesService = require('../Services/PricesService')
const PermissionService = require('../Services/PermissionService')
class AdminController {
    async getAllConsultations(req, res) {
        try {
            let allSlots = []
            let personId = req.user.personId
            if (!personId) {
                personId = req.query.personId
            }
            if (req.user.accessLevel === 4) {
                allSlots = await ConsultationService.getAllSlots()
            }
            else if (req.user.accessLevel === 3 || req.user.accessLevel === 5) {
                allSlots = await ConsultationService.getAllSlotsInMOByAdminId(personId)
            }
            else if (req.user.accessLevel === 2) {
                if (!personId) {throw new ApiError('personId is required', 400)}
                allSlots = await ConsultationService.getAllDoctorSlotsRaw(personId)
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

    async getAllConsultationsV2(req, res) {
        try {
            let allSlots = []
            let personId = req.user.personId
            if (!personId) {
                personId = req.query.personId
            }
            if (req.user.accessLevel === 4) {
                allSlots = await ConsultationService.getAllSlotsV2()
            }
            else if (req.user.accessLevel === 3 || req.user.accessLevel === 5) {
                allSlots = await ConsultationService.getAllSlotsInMOByAdminId(personId)
            }
            else if (req.user.accessLevel === 2) {
                if (!personId) {throw new ApiError('personId is required', 400)}
                allSlots = await ConsultationService.getAllDoctorSlotsRaw(personId)
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

    async getAllConsultationsDate (req, res) {
        try {
            const {date} = req.query
            let allSlots = []
            allSlots = await ConsultationService.getAllSlotsByDate(date)
            /* if (req.user.accessLevel === 4) {
                allSlots = await ConsultationService.getAllSlotsByDate(date)
            }
            else if (req.user.accessLevel === 3 || req.user.accessLevel === 5) {
                allSlots = await ConsultationService.getAllSlotsInMO(req.user.id)
            }
            else if (req.user.accessLevel === 2) {
                allSlots = await ConsultationService.getAllDoctorSlotsRaw(req.user.personId)
            }
            else if (req.user.accessLevel === 1) {

            } */
            
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
        let newSlot = null;
        let newPayment = null;
        let newRoom = null;
        let doctorShortUrl = null;
        let patientShortUrl = null;
        let yookassaPayment = null;
        try {
            const {patient, startDateTime, duration, slotStatusId } = req.body
            const {isCustom, cost} = req.body
            let {doctor} = req.body
            doctor = await DoctorService.getDoctor(doctor.id)
            // Разбираем дату-время на отдельно дату и время
            //Тут нужно увеличить на 3 часа, т.к время на сервере настроено некорректно
            const startDateObj = moment(new Date(startDateTime)).add(3, 'h');
            //startDateObj.setHours(startDateObj.getHours() + 3);
            
            /* console.log(moment(startDateObj).format('yyyy-MM-DD'))
            console.log(moment(startDateObj).format('HH:mm:ss')) */
            const startDate = moment(startDateObj).format('yyyy-MM-DD') // yyyy-MM-dd
            const startTime = moment(startDateObj).format('HH:mm:ss') // HH:mm:ss
            /* console.log(startDate)
            console.log(startTime) */
            //ищем schedule по startDateTime и doctorId
            /* console.log(patient, startDateTime, duration, slotStatusId, isCustom, cost)
            return res.status(500).send('Ошибка') */
            const existingConsultations = (await ConsultationService.getActiveDoctorSlotsByDate(doctor.id, startDate))[0];
            if (existingConsultations && existingConsultations.length > 0) {
                const startNew = new Date(startDateTime);
                const endNew = new Date(startNew.getTime() + duration * 60 * 1000);

                const hasConflict = existingConsultations.some(c => {
                    // некоторые слоты могут быть отменены — их пропускаем
                    if (c.slotStatusId === 5) return false;

                    const startExisting = new Date(c.slotStartDateTime);
                    const endExisting = new Date(c.slotEndDateTime);

                    // Проверка на пересечение интервалов
                    return startNew < endExisting && endNew > startExisting;
                });

                if (hasConflict) {
                    return res.status(400).json({
                        message: "У врача уже есть запись на выбранное время."
                    });
                }
            }
            newSlot = await ConsultationService.createSlot(doctor.id, patient.id, startDateTime, duration, slotStatusId)
            // Приводим стоимость к float
            let numericCost = 0;
            if (cost !== undefined && cost !== null && cost !== '') {
                numericCost = parseFloat(cost);
                if (isNaN(numericCost)) numericCost = 0; // защита от мусора
            }

            // --- 💡 Формируем объект цены
            let price = {
                price: numericCost,
                isFree: !numericCost || numericCost === 0
            };

            // --- Если запись *в расписании*, подменяем цену из БД
            if (!isCustom) {
                const scheduleSlot = await SchedulerService.getDoctorScheduleByDateTime(doctor.id, startDate, startTime);
                price = await PricesService.getPricesByScheduleId(scheduleSlot?.id);
            }
            
        
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
                newSlot.slotStatusId = 3
            }
            await newPayment.save()
            await newSlot.save()

            const roomName = await UserManager.translit(`${doctor.secondName}_${patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
            newRoom = await ConsultationService.createRoom(newSlot.id, roomName)
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
            /* try {
                if (patient.User.email) {
                    const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime);
                    await transporter.sendMail(mailOptionsPatinet); // возвращает Promise, если без callback
                }
                if (doctor.User.email) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(doctor.User.email, doctorLink, newSlot.id, startDateTime);
                    await transporter.sendMail(mailOptionsDoctor);
                }
            } catch (mailErr) {
                // не откатываем транзакцию; логируем и сохраняем задачу на повтор
                console.error('Ошибка отправки почты, создам задачу на retry', mailErr);

            } */
            /* if (patient.User.email) {
                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime)
                transporter.sendMail(mailOptionsPatinet, (error, info) => {
                    if (error) {
                        throw new Error(error)
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

    async createConsultationV2(req, res) {
        let newSlot = null;
        let newPayment = null;
        let newRoom = null;
        let doctorShortUrl = null;
        let patientShortUrl = null;
        let yookassaPayment = null;
        try {
            const {patient, scheduleId, slotStatusId } = req.body
            let {doctor} = req.body
            doctor = await DoctorService.getDoctor(doctor.id)
            // Разбираем дату-время на отдельно дату и время
            //Тут нужно увеличить на 3 часа, т.к время на сервере настроено некорректно

            const schedule = await SchedulerService.getSchedulerById(scheduleId)
            if (schedule.scheduleStatus !== 1 || schedule.slotId) {
                return res.status(400).json({
                    message: "У врача уже есть запись на выбранное время."
                });
            }
            
            
            //const startDateObj = moment(new Date(startDateTime)).add(3, 'h');
            //startDateObj.setHours(startDateObj.getHours() + 3);
            
            /* console.log(moment(startDateObj).format('yyyy-MM-DD'))
            console.log(moment(startDateObj).format('HH:mm:ss')) */
            const startDate = moment(schedule.date).format('yyyy-MM-DD') // yyyy-MM-dd
            //return res.status(400).json(schedule)
            /* console.log(startDate)
            console.log(startTime) */
            //ищем schedule по startDateTime и doctorId
            /* console.log(patient, startDateTime, duration, slotStatusId, isCustom, cost)
            return res.status(500).send('Ошибка') */
            /* const existingConsultations = (await ConsultationService.getActiveDoctorSlotsByDate(doctor.id, startDate))[0];
            if (existingConsultations && existingConsultations.length > 0) {
                const startNew = new Date(startDateTime);
                const endNew = new Date(startNew.getTime() + duration * 60 * 1000);

                const hasConflict = existingConsultations.some(c => {
                    // некоторые слоты могут быть отменены — их пропускаем
                    if (c.slotStatusId === 5) return false;

                    const startExisting = new Date(c.slotStartDateTime);
                    const endExisting = new Date(c.slotEndDateTime);

                    // Проверка на пересечение интервалов
                    return startNew < endExisting && endNew > startExisting;
                });

                if (hasConflict) {
                    return res.status(400).json({
                        message: "У врача уже есть запись на выбранное время."
                    });
                }
            } */
            newSlot = await ConsultationService.createSlotV2(doctor.id, patient.id, schedule, slotStatusId)
            // Приводим стоимость к float
            const price = await PricesService.getPricesByScheduleId(schedule?.id);
            
        
            //Создаём платёж

            //const dateObj = new Date(startDateTime);
            //dateObj.setHours(dateObj.getHours() + 3);

            /* const displayHours = String(dateObj.getHours()).padStart(2, '0');
            const displayMinutes = String(dateObj.getMinutes()).padStart(2, '0');
            const displaySeconds = String(dateObj.getSeconds()).padStart(2, '0');
            const displayTime = `${displayHours}:${displayMinutes}:${displaySeconds}`; */

            const description = `Оплата ТМК на ${moment(startDate).format('DD.MM.YYYY')} ${schedule.scheduleStartTime}`
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
                newSlot.slotStatusId = 3
            }
            await newPayment.save()
            await newSlot.save()
            schedule.slotId = newSlot.id;
            schedule.scheduleStatus = 2;
            await schedule.save()

            const roomName = await UserManager.translit(`${doctor.secondName}_${patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
            newRoom = await ConsultationService.createRoom(newSlot.id, roomName)
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
            /* try {
                if (patient.User.email) {
                    const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime);
                    await transporter.sendMail(mailOptionsPatinet); // возвращает Promise, если без callback
                }
                if (doctor.User.email) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(doctor.User.email, doctorLink, newSlot.id, startDateTime);
                    await transporter.sendMail(mailOptionsDoctor);
                }
            } catch (mailErr) {
                // не откатываем транзакцию; логируем и сохраняем задачу на повтор
                console.error('Ошибка отправки почты, создам задачу на retry', mailErr);

            } */
            /* if (patient.User.email) {
                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientLink, startDateTime)
                transporter.sendMail(mailOptionsPatinet, (error, info) => {
                    if (error) {
                        throw new Error(error)
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

    async editConsultation(req, res) {
        try {
            const { slotId, doctor, patient, startDateTime, duration, slotStatusId } = req.body;
            const oldSlot = await ConsultationService.getSlotById(slotId);
            const oldDoctor = await DoctorService.getDoctor(oldSlot.doctorId);
            const oldPatient = await PatientService.getPatient(oldSlot.patientId);
            // Обновляем слот



            
            const updatedSlot = await ConsultationService.updateSlot(slotId, 
                doctor.id,
                patient.id,
                startDateTime,
                duration,
                slotStatusId
            );

            

            

            // Получаем комнату по слоту
            const room = (await ConsultationService.getSlotById(slotId)).Room;
            if (!room) return res.status(404).json({ message: "Комната не найдена" });

            const roomName = room.roomName;
            // Генерация ссылок и токенов
            const doctorPayload = await ConsultationService.createPayloadDoctor(doctor.id, room.id);
            const patientPayload = await ConsultationService.createPayloadPatient(patient.id, room.id);
            const tokenDoctor = jwt.sign(doctorPayload, JITSI_SECRET);
            const tokenPatient = jwt.sign(patientPayload, JITSI_SECRET);
            const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`;
            const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`;

            // Обновляем короткие ссылки url, userId, roomId, type = 'room'
            const doctorShortUrl = await UrlManager.updateShort(doctorUrl, doctor.User.id, room.id, 'room', oldDoctor.User.id);
            const patientShortUrl = await UrlManager.updateShort(patientUrl, patient.User.id, room.id, 'room', oldPatient.User.id);

            // Отправляем почту, если надо
            const transporter = await MailManager.getTransporter();
            
            const patientLink = SERVER_DOMAIN + 'short/' + patientShortUrl;
            const doctorLink = SERVER_DOMAIN + 'short/' + doctorShortUrl;
            if (slotStatusId == 3) {
                const payment = await PaymentService.getPaymentBySlotId(slotId);
                payment.paymentStatusId = 3
                await payment.save()
                if (patient.User.email) {
                    const mailOptionsPatient = await MailManager.getMailOptionsTMKLink(
                        patient.User.email,
                        patientUrl,
                        startDateTime
                    );
                    transporter.sendMail(mailOptionsPatient);
                }

                if (doctor.User.email) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(
                        doctor.User.email,
                        doctorUrl,
                        slotId,
                        startDateTime
                    );
                    transporter.sendMail(mailOptionsDoctor);
                }
            }
            else if (slotStatusId == 5) {
                room.roomName = room.roomName + '_canceled_' + Date.now()
                const payment = await PaymentService.getPaymentBySlotId(slotId);
                payment.paymentStatusId = 5
                await payment.save()
                await room.save()
            }
            //Отключаем отправку тут, отпрапвляем теперь в случае оплаты
            /* if (patient.User.email) {
                const mailOptionsPatient = await MailManager.getMailOptionsTMKLink(
                    patient.User.email,
                    patientLink,
                    startDateTime
                );
                transporter.sendMail(mailOptionsPatient);
            }

            if (doctor.User.email) {
                const mailOptionsDoctor = await MailManager.getMailOptionsTMKLink(
                    doctor.User.email,
                    doctorLink,
                    startDateTime
                );
                transporter.sendMail(mailOptionsDoctor);
            } */

            res.status(200).json({
                doctorShortUrl,
                patientShortUrl,
                updatedSlot,
                room
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
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
                if (!req.query.profileId) throw ApiError.BadRequest('ProfileId не может быть Null')
                const medOrg = await MedicalOrgService.getMedOrgByAdminId(req.query.profileId)
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
    
    async editDoctor(req, res) {
        try {
            const id = req.params.id;
            const { user } = req.body; // теперь весь объект user
            const doctor = await DoctorService.getDoctor(id);

            if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

            // Обновляем поля доктора
            doctor.secondName = user.secondName;
            doctor.firstName = user.firstName;
            doctor.patronomicName = user.patronomicName;
            doctor.snils = user.snils;
            doctor.info = user.info;
            await doctor.save();

            // Обновляем пользователя
            doctor.User.email = user.User.email;
            doctor.User.confirmed = user.User.confirmed;
            doctor.User.phone = user.User.phone;
            await doctor.User.save();

            // Обновляем посты через setPosts
            if (Array.isArray(user.postIds) && user.postIds.length > 0) {
                await doctor.setPosts(user.postIds);
            } else if (Array.isArray(user.Posts) && user.Posts.length > 0) {
                const postIdsFromPosts = user.Posts.map(p => p.id);
                await doctor.setPosts(postIdsFromPosts);
            }

            // Возвращаем обновленного доктора
            const updatedDoctor = await DoctorService.getDoctor(id);
            res.status(200).json(updatedDoctor);

        } catch (e) {
            console.error(e);
            res.status(500).json({ message: e.message });
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
            patient.birthDate = user.birthDate
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
            /* console.log(req.body)
            return res.status(201).json({ message: 'Врач создан успешно'}); */
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
                snils,
                postIds 
            } = req.body;
            let postIdsArray = [];

            if (Array.isArray(postIds)) {
                postIdsArray = postIds.map(id => parseInt(id, 10));
            } else if (typeof postIds === 'string') {
                try {
                    // Пробуем разобрать JSON-строку
                    const parsed = JSON.parse(postIds);
                    if (Array.isArray(parsed)) {
                        postIdsArray = parsed.map(id => parseInt(id, 10));
                    } else {
                        postIdsArray = [parseInt(parsed, 10)];
                    }
                } catch (e) {
                    // Если JSON.parse не сработал, пробуем взять как одно число
                    postIdsArray = [parseInt(postIds, 10)];
                }
            }

            const firstPostId = postIdsArray[0];
            const remainingPostIds = postIdsArray.slice(1);
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
            const transporter = await MailManager.getTransporter()
            if (req.user.accessLevel == 4) {
                const newUser = await userService.createUser(2, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
                
                const newDoctor = await DoctorService.createDoctor(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils, 1, firstPostId)
                if (remainingPostIds.length > 0) {
                    const postLinks = remainingPostIds.map(postId => ({
                        doctorId: newDoctor.id,
                        postId
                    }));
                    await database.models.DoctorPosts.bulkCreate(postLinks);
                }
                if (email) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsRegisterDoctor(
                        email,
                        phone,
                        password
                    );
                    transporter.sendMail(mailOptionsDoctor);
                }
                return res.status(201).json({ message: 'Врач создан успешно', userId: newUser.id, doctorId: newDoctor.id });
            }
            else if (req.user.accessLevel == 3) {
                
                if (!req.query.profileId) throw ApiError.BadRequest('ProfileId не может быть Null')
                const medOrg = await MedicalOrgService.getMedOrgByAdminId(req.query.profileId)
                if (!medOrg) {
                    throw ApiError.BadRequest('Ошибка определения медицинской организации. Обратитесь в поддержку.')
                }
                const newUser = await userService.createUser(2, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
                
                const newDoctor = await DoctorService.createDoctor(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils, medOrg.id, firstPostId)
                if (remainingPostIds.length > 0) {
                    const postLinks = remainingPostIds.map(postId => ({
                        doctorId: newDoctor.id,
                        postId
                    }));
                    await database.models.DoctorPosts.bulkCreate(postLinks);
                }
                if (email) {
                    const mailOptionsDoctor = await MailManager.getMailOptionsRegisterDoctor(
                        email,
                        phone,
                        password
                    );
                    transporter.sendMail(mailOptionsDoctor);
                }
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
            const transporter = await MailManager.getTransporter()
            const newUser = await userService.createUser(1, phone, password, avatar ? SERVER_DOMAIN + 'uploads/' + avatar.filename : null, email, phone)
            const newPatient = await PatientService.createPatient(newUser.id, secondName, name, patrinomicName, formattedDate, info, snils)
            if (email) {
                const mailOptionsPatient = await MailManager.getMailOptionsRegisterPatient(
                    email,
                    phone,
                    password
                );
                transporter.sendMail(mailOptionsPatient);
            }

            res.status(201).json({ message: 'Пациент создан успешно', userId: newUser.id, patientId: newPatient.id });
        }
        catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getAllSlotStatuses (req, res) {
        try {
            const statuses = await ConsultationService.getSlotStatuses();
            res.status(200).json(statuses);
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e.message)
        }
    }

    async getPermissionsList(req, res) {
        try {
            const permissions = await PermissionService.getPermissionsList()
            res.status(200).json(permissions)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async getDoctorPermissions(req, res) {
        try {
            const {id} = req.params
            const permissions = await PermissionService.getPermissionsByDoctorId(id)
            res.status(200).json(permissions)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async setDoctorPermissons(req, res) {
        try {
            
            const user = req.user
            if (!user) throw ApiError.AuthError('Неизвестный пользователь')
            const { permissionIds } = req.body;
            //console.log(permissionIds)
            const {id} = req.params
            await database.models.DoctorPermissions.destroy({ where: { doctorId: id } });

            // Добавляем новые
            const records = permissionIds.map(pid => ({
                doctorId: id,
                permissionId: pid,
                grantedBy: user.id
            }));

            await database.models.DoctorPermissions.bulkCreate(records);

            res.status(200).json({ message: 'Права успешно обновлены', count: records.length });
        }
        catch (e) {
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

module.exports = new AdminController();