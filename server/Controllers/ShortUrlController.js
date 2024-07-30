const UrlManager = require('../Utils/UrlManager')

class ShortUrlController {
    async index(req, res) {
        const { shortUrl } =  req.params;
        const url = await UrlManager.returnFullUrl(shortUrl)
        res.redirect(url)
    }

    async create(req, res)  {
        const { url }  =  req.body;
        const  { shortUrl }  =  await UrlManager.createShort(url)
        res.send(shortUrl)
    }
}

module.exports = new ShortUrlController();