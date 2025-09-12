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
class PatientController {
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
}
module.exports = new PatientController();