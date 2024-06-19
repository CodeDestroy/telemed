const Router = require('express');
const router = new Router();
const ConferenceController = require('../Controllers/ConferenceContorller');

router.post('/join', ConferenceController.join)
router.post('/leave', ConferenceController.leave)

module.exports = router;