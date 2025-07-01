const ALPHABET = process.env.NANOID_ALPHABET;

const database = require('../Database/setDatabase')
const SERVER_URL = process.env.SERVER_URL

class UrlManager {
    async createShort(url, userId, roomId, type = 'room') {
        const { customAlphabet } = await import('nanoid');
        const nanoid = customAlphabet(ALPHABET, 10);
        const shortUrl = nanoid();
        const newUrlEntity = await database.models.Url.create({originalUrl: url, shortUrl: shortUrl, userId, roomId, type});
        return newUrlEntity.shortUrl;
    }

    async returnFullUrl(shortUrl)  {
        const url  = await database.models.Url.findOne({where: {shortUrl: shortUrl}})
        if (!url) {return ''}
        return url.originalUrl;
    }

    async updateShort(url, userId, roomId, type = 'room', oldUserId = null) {
        let existingUrl = null;
        if (oldUserId) {
            existingUrl = await database.models.Url.findOne({
                where: {
                    roomId,
                    userId: oldUserId,
                    type
                }
            });
            existingUrl.userId = userId; 
        }
        else {
            existingUrl = await database.models.Url.findOne({
                where: {
                    roomId,
                    userId,
                    type
                }
            });
        }

        if (!existingUrl) {
            throw new Error('Короткая ссылка не найдена');
        }

        existingUrl.originalUrl = url;
        await existingUrl.save();

        return existingUrl.shortUrl;
        
        
    }


}

module.exports = new UrlManager();