const Router = require('express');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware')
const IntegrationController = require('../Controllers/IntegrationController')
router.get('/getOnlineSched', /* AuthMiddleware, */ IntegrationController.getOnlineSched)
router.post('/setOnlineRequestPaid', IntegrationController.setOnlineRequestPaid)
module.exports = router;