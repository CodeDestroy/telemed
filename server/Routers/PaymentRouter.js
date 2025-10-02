const Router = require('express');
const router = new Router();
const PaymentController = require('../Controllers/PaymentController');
const rateLimit = require("express-rate-limit");

const checkPaymentLimiter = rateLimit({
    windowMs: 15 * 1000, // окно в 15 секунд
    max: 3,              // не больше 3 запросов за окно
    message: { message: "Слишком часто проверяете статус, попробуйте позже" }
});

router.get('/', PaymentController.getPayment)
router.get('/all', PaymentController.getPayments)
router.get('/statuses', PaymentController.getPaymentsStatuses)
router.post('/yokassa/webhook', PaymentController.yookassaWebhook)

router.get('/checkPaymentStatus', checkPaymentLimiter, PaymentController.checkPaymentStatus)

module.exports = router;