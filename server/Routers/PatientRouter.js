const Router = require('express');
const router = new Router();
const DoctorController = require('../Controllers/DoctorController')
const SchedulerController = require('../Controllers/SchedulerController');
const ConferenceContorller = require('../Controllers/ConferenceContorller');

router.get('/consultations/protocol', ConferenceContorller.getProtocolByRoomName)
module.exports = router;