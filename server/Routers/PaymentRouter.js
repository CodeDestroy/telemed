const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController');
const ConferenceContorller = require('../Controllers/ConferenceContorller');
const PatientController = require('../Controllers/PatientController');
const MainController = require('../Controllers/MainController');
const AdminController = require('../Controllers/AdminController');
const PaymentController = require('../Controllers/PaymentController');

router.get('/', PaymentController.getPayment)
router.get('/all', PaymentController.getPayments)
router.get('/statuses', PaymentController.getPaymentsStatuses)
module.exports = router;