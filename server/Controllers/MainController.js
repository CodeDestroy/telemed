const ConsultationService = require("../Services/ConsultationService");

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

}

module.exports = new MainController()
