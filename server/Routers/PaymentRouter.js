const Router = require('express');
const router = new Router();
const PaymentController = require('../Controllers/PaymentController');

router.get('/', PaymentController.getPayment)
router.get('/all', PaymentController.getPayments)
router.get('/statuses', PaymentController.getPaymentsStatuses)
router.post('/yokassa/webhook', PaymentController.yookassaWebhook)

module.exports = router;