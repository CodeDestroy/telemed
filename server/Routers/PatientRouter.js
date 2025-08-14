const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController');
const ConferenceContorller = require('../Controllers/ConferenceContorller');
const PatientController = require('../Controllers/PatientController');
const MainController = require('../Controllers/MainController');

router.get('/consultations/protocol', ConferenceContorller.getProtocolByRoomName)
router.get('/doctorList', DoctorController.getDoctorList)
router.get('/doctor', DoctorController.getDoctor)
router.get('/postsList', DoctorController.getPostsList)
router.get('/consultations', PatientController.getConsultations)
router.get('/consultation', MainController.getConsultationById)

module.exports = router;