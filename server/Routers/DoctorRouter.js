const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController')
router.get('/consultations/active', DoctorController.getConsultations)
router.get('/consultations/ended', DoctorController.getEndedConsultations)
router.get('/scheduler/:id', SchedulerController.getDoctorScheduler)
router.get('/scheduler/date/:id', SchedulerController.getDoctorSchedulerDate)
router.post('/scheduler', SchedulerController.createOrUpdateSchedule)
/* router.get('/scheduler', SchedulerController.getDoctorScheduler) */
router.post('/scheduler/delete', SchedulerController.deleteDoctorScheduler)
router.post('/scheduler/setScheduleType', SchedulerController.setScheduleType)
router.post('/scheduler/dates/add',  SchedulerController.addScheduleDate)
router.post('/scheduler/dates/edit/:id',  SchedulerController.editScheduleDate)
module.exports = router;