const ALPHABET = process.env.NANOID_ALPHABET;

const database = require('../Database/setDatabase')
const SERVER_URL = process.env.SERVER_URL

class UrlManager {
    async createShort(url, userId, roomId) {
        const { customAlphabet } = await import('nanoid');
        const nanoid = customAlphabet(ALPHABET, 10);
        const shortUrl = nanoid();
        const newUrlEntity = await database.models.Url.create({originalUrl: url, shortUrl: shortUrl, userId, roomId})
        return newUrlEntity.shortUrl;
    }

    async returnFullUrl(shortUrl)  {
        const url  = await database.models.Url.findOne({where: {shortUrl: shortUrl}})
        if (!url) {return ''}
        return url.originalUrl;
    }
}

module.exports = new UrlManager();