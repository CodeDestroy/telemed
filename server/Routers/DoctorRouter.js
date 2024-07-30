const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')

router.get('/consultations/active', DoctorController.getConsultations)
router.get('/consultations/ended', DoctorController.getEndedConsultations)

module.exports = router;