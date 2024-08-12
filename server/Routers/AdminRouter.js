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
router.get('/consultations/ended', AdminController.getEndedConsultations)
router.post('/consultations/create', AdminController.createConsultation)
router.get('/patients/all', AdminController.getAllPatients)
router.get('/patients/:id', AdminController.getPatient)
router.get('/doctors/all', AdminController.getAllDoctors)
router.get('/doctors/:id', AdminController.getDoctor)

router.post('/patients/create', upload.single('avatar'), AdminController.createPatient)
module.exports = router;