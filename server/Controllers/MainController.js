const ConsultationService = require("../Services/ConsultationService");

const { Op } = require('sequelize');
const database = require('../Database/setDatabase')
class MainController {
    async testFunc (req, res) {
        const data = req.query.data
        res.json({data: (data + ' returned')});
    }

    async getConsultationById (req, res) {
        try {
            const id = req.query.id;
            const consultation = await ConsultationService.getSlotById(id);
            res.json(consultation);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }


    async getMkb(req, res) {
        try {
            const { level_gt, search, limit = 50, offset = 0 } = req.query;
            const where = {};
            if (level_gt) {
                where.level = { [Op.gt]: Number(level_gt) };
            }
            if (search) {
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { code: { [Op.iLike]: `%${search}%` } },
                ];
            }
            const diagnoses = await database.models.mkbDiagnosis.findAll({
                where,
                order: [['code', 'ASC']],
                limit: Number(limit),
                offset: Number(offset),
            });

            res.status(200).json(diagnoses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при получении диагнозов' });
        }
    }

}

module.exports = new MainController()
