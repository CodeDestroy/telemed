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
const ApiError = require("../Errors/api-error");
const yookassaApi = require("../Api/yookassaApi");
class PatientController {

    async yookassaWebhook(req, res) {
        try {
            const notification = req.body;

            if (notification.type !== "notification") {
                return res.status(400).send("Invalid notification type");
            }

            const yookassaPayment = notification.object;

            const payment = await PaymentService.getPaymentByYookassaId(yookassaPayment.id)
            const slot = await ConsultationService.getSlotById(payment.slotId)
            const doctor = await DoctorService.getDoctor(slot.doctorId)
            const patient = await PatientService.getPatient(slot.patientId)
            const patientUrl = await UrlManager.getUrlBySlotId(slot.id, patient.userId)
            const doctorUrl = await UrlManager.getUrlBySlotId(slot.id, doctor.userId)
            const transporter = await MailManager.getTransporter()
            switch (notification.event) {
                case "payment.waiting_for_capture":
                    // 💡 Тут можно решить: сразу списывать или ждать ручного подтверждения
                    //await db.updatePaymentStatus(payment.id, "waiting_for_capture");
                    
                    payment.paymentStatusId = 2 // "Ожидает подтверждения"
                    console.log(`Платёж ${yookassaPayment.id} ожидает подтверждения`);
                    break;

                case "payment.succeeded":
                    //await db.updatePaymentStatus(payment.id, "succeeded");
                    if (payment.paymentStatusId != 3) {
                        payment.paymentStatusId = 3 // "Оплачен"
                        try {
                            if (patient.User.email) {
                                const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientUrl.originalUrl, slot.slotStartDateTime);
                                await transporter.sendMail(mailOptionsPatinet); // возвращает Promise, если без callback
                            }
                            if (doctor.User.email) {
                                const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(doctor.User.email, doctorUrl.originalUrl, slot.id, slot.slotStartDateTime);
                                await transporter.sendMail(mailOptionsDoctor);
                            }
                        } catch (mailErr) {
                            // не откатываем транзакцию; логируем и сохраняем задачу на повтор
                            console.error('Ошибка отправки почты, создам задачу на retry', mailErr);
                            /* await EmailJobService.create({
                                toPatient: patient.User.email || null,
                                toDoctor: doctor.User.email || null,
                                patientLink,
                                doctorLink,
                                startDateTime,
                                payload: { newSlotId: newSlot.id, newRoomId: newRoom.id, newPaymentId: newPayment.id },
                                attempts: 0
                            }); */
                            // возможно оповестить админов/логирование
                        }
                    }
                    
                    console.log(`Платёж ${yookassaPayment.id} успешно оплачен`);
                    break;

                case "payment.canceled":
                    //await db.updatePaymentStatus(payment.id, "canceled");
                    payment.paymentStatusId = 5; // Отмена оплаты
                    slot.slotStatusId = 5; // Помечаем слот как "Отменено"
                    slot.Room.roomName = slot.Room.roomName + '_cancel_' + payment.id
                    await slot.save()
                    await slot.Room.save()
                    console.log(`Платёж ${yookassaPayment.id} ушёл в ошибку`);
                    break;

                default:
                    console.log(`Необработанное событие: ${notification.event}`);
                    if (payment)
                        payment.paymentStatusId = 4
            }
            if (payment) {
                payment.yookassa_status = yookassaPayment.status
                payment.save()
            }

            res.status(200).send("OK"); // YooKassa ожидает ответ 200
        } catch (err) {
            console.error("Ошибка обработки webhook:", err.message);
            res.status(500).send("Internal Server Error");
        }
    }


    async createPayment(req, res) {
        try {
            const { amount, currency, description, userId, consultationId,  } = req.body;
            let {payment_method_data} = req.body
            if (!payment_method_data) {
                payment_method_data = 'bank_card'
            }
            const payment = await PaymentService.createPayment(amount, currency, description, userId, consultationId)
            const yookassaPayment = await yookassaApi.createPayment({
                amount,
                description,
                returnUrl: "https://example.com/success",
                idempotenceKey: payment.uuid4,
                payment_method_data
            });
            res.status(200).json({
                ...payment,
                yookassaId: yookassaPayment.id,
                confirmationUrl: yookassaPayment.confirmation.confirmation_url,
            });
        }
        catch (e) {
            if (payment) {
                // ⚠️ обновляем статус платежа в БД на "failed"
                await PaymentService.updatePayment(payment.id, { status: "failed" });
                await PaymentService.updatePayment(payment.id, {
                    yookassa_status: "failed",
                    paymentStatusId: 5, // "Ошибка оплаты"
                });
            }
            res.status(500).json({
                message: e.message
            })
        }
    }
    async getPayment (req, res) {
        const { uuid } = req.query;
        try {
            const payment = await PaymentService.getPaymentByUUID(uuid)
            if (!payment) return ApiError.BadRequest('Not found')
            res.status(200).json(payment);
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    }

    async getPayments(req, res) {
        try {
            const { userId } = req.query;
            const payments = await PaymentService.getPaymentsByUserId(userId)
            res.status(200).json(payments);
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    }

    async getPaymentsStatuses (req, res) {
        try {
            const statuses = await PaymentService.getPaymentsStatuses()
            res.status(200).json(statuses);
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            })
        }

    }

    async checkPaymentStatus(req, res) {
        try {
            const { uuid } = req.query;
            if (!uuid) {
                return res.status(400).json({ message: "uuid is required" });
            }

            // 1. Ищем платеж в БД
            const payment = await PaymentService.getPaymentByUUID(uuid)
            const slot = await ConsultationService.getSlotById(payment.slotId)
            const doctor = await DoctorService.getDoctor(slot.doctorId)
            const patient = await PatientService.getPatient(slot.patientId)
            const patientUrl = await UrlManager.getUrlBySlotId(slot.id, patient.userId)
            const doctorUrl = await UrlManager.getUrlBySlotId(slot.id, doctor.userId)
            const transporter = await MailManager.getTransporter()
            if (!payment) {
                return res.status(404).json({ message: "Платёж не найден" });
            }

            if (!payment.yookassa_id) {
                return res.status(400).json({ message: "Для этого платежа нет yookassa_id" });
            }

            // 2. Запрос к Юкассе
            const yookassaPayment = await yookassaApi.getPayment(payment.yookassa_id);
            
            // 3. Обновляем данные в БД
            payment.yookassa_status = yookassaPayment.status;
            payment.yookassa_payment_method_type = yookassaPayment.payment_method?.type || null;

            // Меняем paymentStatusId в зависимости от статуса
            if (yookassaPayment.status === "succeeded") {
                if (payment.paymentStatusId != 3) { // Если платеж ещё не оплачен
                    payment.paymentStatusId = 3; // Оплачено
                    try {
                        if (patient.User.email) {
                            const mailOptionsPatinet = await MailManager.getMailOptionsTMKLink(patient.User.email, patientUrl.originalUrl, slot.slotStartDateTime);
                            await transporter.sendMail(mailOptionsPatinet); // возвращает Promise, если без callback
                        }
                        if (doctor.User.email) {
                            const mailOptionsDoctor = await MailManager.getMailOptionsTMKLinkDoctor(doctor.User.email, doctorUrl.originalUrl, slot.id, slot.slotStartDateTime);
                            await transporter.sendMail(mailOptionsDoctor);
                        }
                    } catch (mailErr) {
                        // не откатываем транзакцию; логируем и сохраняем задачу на повтор
                        console.error('Ошибка отправки почты, создам задачу на retry', mailErr);
                        /* await EmailJobService.create({
                            toPatient: patient.User.email || null,
                            toDoctor: doctor.User.email || null,
                            patientLink,
                            doctorLink,
                            startDateTime,
                            payload: { newSlotId: newSlot.id, newRoomId: newRoom.id, newPaymentId: newPayment.id },
                            attempts: 0
                        }); */
                        // возможно оповестить админов/логирование
                    }

                }
                
                slot.slotStatusId = 3; // Помечаем слот как "Оплачено"
            } else if (yookassaPayment.status === "canceled") {
                payment.paymentStatusId = 5; // Отмена оплаты
                slot.slotStatusId = 5; // Помечаем слот как "Отменено"
            } else if (yookassaPayment.status === "waiting_for_capture" || yookassaPayment.status === "pending") {
                payment.paymentStatusId = 2; // В обработке
                slot.slotStatusId = 2; // Помечаем слот как "Ждёт оплаты"
            }

            await slot.save()
            await payment.save();

            // 4. Возвращаем обновлённые данные
            return res.status(200).json({
                uuid4: payment.uuid4,
                yookassa_status: payment.yookassa_status,
                paymentStatusId: payment.paymentStatusId,
                confirmation_url: payment.yookassa_confirmation_url
            });

        } catch (e) {
            console.error("Ошибка при проверке платежа:", e);
            return res.status(500).json({
                message: e.message
            });
        }
    }

}
module.exports = new PatientController();