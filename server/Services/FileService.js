const path = require('path');
const fs = require('fs');
const database = require('../Database/setDatabase'); // твой sequelize instance
const { Attachments } = database.models;

const crypto = require('crypto');
class FileService {
    /**
     * Сохранение информации о файле в БД
     * @param {Object} file — объект файла из multer (req.file)
     * @param {number} slotId — ID консультации (слота)
     * @param {number} patientId — ID пациента (может быть null)
     */

    async calculateFileHash(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(filePath);

            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    async saveFile(file, slotId, patientId = null) {
        if (!file) {
            throw new Error('Файл не передан');
        }

        // Проверяем наличие директории uploads
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
           fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, file.filename);
        const hash = await this.calculateFileHash(filePath);

        const existingFile = await Attachments.findOne({
          where: { hash, slotId },
        });

        if (existingFile) {
            // Удаляем загруженный дубликат
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            return {
                ...existingFile.toJSON(),
                duplicate: true, // 👈 флаг, чтобы фронт знал, что это дубликат
            };
        }

        const newFile = await Attachments.create({
            slotId,
            patientId,
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            hash,
        });

        return newFile;
    }

    /**
     * Получение списка файлов по ID консультации
     */
    async getFilesBySlot(slotId) {
        const files = await Attachments.findAll({
            where: { slotId },
            order: [['createdAt', 'DESC']],
        });
        return files;
    }

    /**
     * Удаление файла (по id)
     */
    async deleteFile(fileId) {
        const file = await Attachments.findByPk(fileId);
        if (!file) throw new Error('Файл не найден');

        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await file.destroy();
        return { message: 'Файл удалён' };
    }
}

module.exports = new FileService();
