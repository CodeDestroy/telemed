const Router = require('express');
const router = new Router();
const HealthyChildController = require('../Controllers/HealthyChildController')
const IntegrationMiddleware = require('../middleware/IntegrationMiddleware')

router.post('/createConsultation',  HealthyChildController.createConsultation)

module.exports = router;