const PatientService = require("../Services/PatientService")
const ConsultationService = require("../Services/ConsultationService")
class PatientController {
    async getConsultations (req, res) {
        try {
            /* const {userId} = req.query
            console.log(data)
            return res.status(200).json({data}) */
            const {userId} = req.query
            const patient = await PatientService.getPatientByUserId(userId)
            const activeSlots = await ConsultationService.getEndedPatientSlots(patient.id)

            res.status(200).json(activeSlots[0])
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        /* try {
            const {userId} = req.query
            const doctor = await DoctorService.getDoctorByUserId(userId)
            const activeSlots = await ConsultationService.getEndedDoctorSlots(doctor.id)
            res.status(200).json(activeSlots)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        } */
    }

    

}

module.exports = new PatientController()
