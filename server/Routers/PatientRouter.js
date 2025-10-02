const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController');
const ConferenceContorller = require('../Controllers/ConferenceContorller');
const PatientController = require('../Controllers/PatientController');
const MainController = require('../Controllers/MainController');
const AdminController = require('../Controllers/AdminController');

router.get('/consultations/protocol', ConferenceContorller.getProtocolByRoomName)
router.get('/doctorList', DoctorController.getDoctorList)
router.get('/doctor', DoctorController.getDoctor)
router.get('/postsList', DoctorController.getPostsList)
router.get('/consultations', PatientController.getConsultations)
router.get('/consultation', MainController.getConsultationById)
router.get('/scheduler/date/:id', SchedulerController.getDoctorSchedulerDate)
router.get('/consultations/active', PatientController.getConsultationsByDoctorId)
router.post('/consultations/create', PatientController.createConsultation)
router.get('/consultation/url', PatientController.getConsultationUrl)
router.post('/consultations/getPrice', PatientController.getConsultationPrice)


module.exports = router;