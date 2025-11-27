const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController');
const AdminController = require('../Controllers/AdminController');
const multer = require('multer');
const path = require('path');
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Путь, куда будут сохраняться файлы
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
    }
});
  
const upload = multer({ storage: storage });

router.get('/consultations/all', AdminController.getAllConsultations)
router.get('/v2/consultations/all', AdminController.getAllConsultationsV2)
router.get('/consultations/date', AdminController.getAllConsultationsDate)
router.get('/consultations/ended', AdminController.getEndedConsultations)
router.post('/consultations/create', AdminController.createConsultation)
router.post('/v2/consultations/create', AdminController.createConsultationV2)
router.post('/consultations/edit', AdminController.editConsultation)

router.post('/doctors/create', upload.single('avatar'), AdminController.createDoctor)

router.post('/patients/create', upload.single('avatar'), AdminController.createPatient)
router.get('/patients/all', AdminController.getAllPatients)
router.get('/patients/:id', AdminController.getPatient)
router.post('/patients/:id', AdminController.editPatient)
router.get('/doctors/all', AdminController.getAllDoctors)
router.get('/doctors/:id', AdminController.getDoctor)
router.post('/doctors/:id', AdminController.editDoctor)
router.get('/slotStatuses/all', AdminController.getAllSlotStatuses)

router.get('/doctors/specialties/all', DoctorController.getPostsList)


router.get('/permissions', AdminController.getPermissionsList)
router.get('/permissions/doctor/:id', AdminController.getDoctorPermissions)
router.put('/permissions/doctor/:id', AdminController.setDoctorPermissons)


module.exports = router;