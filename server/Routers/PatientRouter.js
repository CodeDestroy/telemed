const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController');
const ConferenceContorller = require('../Controllers/ConferenceContorller');
const PatientController = require('../Controllers/PatientController');
const MainController = require('../Controllers/MainController');
const AdminController = require('../Controllers/AdminController');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const uploadMiddleware = multer({ storage });

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


router.post('/consultations/:id/files', uploadMiddleware.single('file'), PatientController.uploadFile)

router.get('/consultations/:id/files', PatientController.getFiles)


module.exports = router;