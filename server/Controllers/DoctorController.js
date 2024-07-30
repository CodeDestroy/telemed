const DoctorService = require('../Services/DoctorService')
const ConsultationService = require('../Services/ConsultationService')

class DoctorController {
    async getConsultations(req, res) {
        try {
            const {userId} = req.query
            const doctor = await DoctorService.getDoctorByUserId(userId)
            const activeSlots = await ConsultationService.getActiveDoctorSlots(doctor.id)
            res.status(200).json(activeSlots)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        
    }

    async getEndedConsultations (req, res) {
        try {
            const {userId} = req.query
            const doctor = await DoctorService.getDoctorByUserId(userId)
            const activeSlots = await ConsultationService.getEndedDoctorSlots(doctor.id)
            res.status(200).json(activeSlots)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }
}

module.exports = new DoctorController();