const { where } = require('sequelize');
const database = require('../Database/setDatabase')
class PaymentService {
    async createPayment(userId, payTypeId, amount, slotId, paymentDetails) {
        try {
            const newPayment = await database.models.Payments.create({userId, payTypeId, amount, slotId, paymentDetails, paymentStatusId: 1})
            return newPayment
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }

    async getPaymentByUUID(uuid) {
        try {
            const payment = await database.models.Payments.findOne({
                where: { uuid4: uuid },
                include: [
                    {
                        model: database.models.Slots,
                        include: [
                            { model: database.models.Doctors, include: [database.models.Posts, database.models.MedicalOrgs, database.models.Users] },
                            { model: database.models.Patients },
                        ],
                    },
                ],}
            )
            return payment
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }

    async getPaymentsByUserId(userId) {
        try {
            const payments = await database.models.Payments.findAll({
                where: { userId },
                include: [
                    {
                        model: database.models.Slots,
                        include: [
                            { model: database.models.Doctors, include: [database.models.Posts, database.models.MedicalOrgs, database.models.Users] },
                            { model: database.models.Patients },
                        ],
                    },
                ],}
            )
            return payments
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }

    async getPaymentsStatuses() {
        try {
            const statuses = await database.models.PaymentStatus.findAll()
            return statuses
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }
}


module.exports = new PaymentService();