const Router = require('express');
const router = new Router();
const ConferenceController = require('../Controllers/ConferenceContorller');

router.post('/join', ConferenceController.join)
router.post('/leave', ConferenceController.leave)
router.post('/participantJoined', ConferenceController.participantJoined)
router.post('/end', ConferenceController.endConference)
module.exports = router;