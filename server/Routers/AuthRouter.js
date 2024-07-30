const Router = require('express');
const router = new Router();
const MainController = require('../Controllers/MainController');
const AuthController = require('../Controllers/AuthController');

router.post('/login', AuthController.login)
router.get('/refresh', AuthController.refresh)
router.get('/logout', AuthController.logout)
router.get('/check-phone', AuthController.checkPhone)
router.post('/confirm-registration', AuthController.confirmRegistration)
router.post('/confirm-email', AuthController.confirmEmail)
module.exports = router;