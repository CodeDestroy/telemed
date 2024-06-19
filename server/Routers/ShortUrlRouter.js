const Router = require('express');
const ShortUrlController = require('../Controllers/ShortUrlController');
const router = new Router();

router.get('/:shortUrl', ShortUrlController.index)
router.post('/create', ShortUrlController.create)
module.exports = router;