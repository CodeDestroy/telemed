const Router = require('express');
const router = new Router();
const MainController = require('../Controllers/MainController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
router.get('/', AuthMiddleware,  MainController.testFunc)

module.exports = router;