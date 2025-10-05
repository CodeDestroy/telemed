const DoctorService = require('../Services/DoctorService')
const ConsultationService = require('../Services/ConsultationService')
const SchedulerService = require('../Services/SchedulerService')

class DoctorController {
    async getConsultations(req, res) {
        try {
            const {userId} = req.query
            const doctor = await DoctorService.getDoctorByUserId(userId)
            const {date} = req.query
            let activeSlots = []
            if (!date) {
                activeSlots = await ConsultationService.getActiveDoctorSlots(doctor.id)
                
            }
            else {
                activeSlots = await ConsultationService.getActiveDoctorSlotsByDate(doctor.id, date)
            }
            res.status(200).json(activeSlots)
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        
    }

    async getConsultationsByDoctorId(req, res) {
        try {
            const {doctorId} = req.query
            const doctor = await DoctorService.getDoctor(doctorId)
            const {date} = req.query
            let activeSlots = []
            if (!date) {
                activeSlots = await ConsultationService.getActiveDoctorSlots(doctor.id)
                
            }
            else {
                activeSlots = await ConsultationService.getActiveDoctorSlotsByDate(doctor.id, date)
            }
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

    async getEndedConsultationsByDoctorId (req, res) {
        try {
            const {doctorId} = req.query
            const doctor = await DoctorService.getDoctor(doctorId)
            const activeSlots = await ConsultationService.getEndedDoctorSlots(doctor.id)
            res.status(200).json(activeSlots)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }


    async getConsultationBySlotId (req, res) {
        try {
            const {id} = req.params
            const consultation = await ConsultationService.getSlotById(id)
            res.status(200).json(consultation)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async getDoctorList (req, res) {
        try {
            const {dateStart} = req.query
            const {medOrgId} = req.query
            const doctors = await DoctorService.getDoctorsWithPostsByMedOrgId(medOrgId)
            const wrappedDoctors = await Promise.all(
                doctors.map(async (doc) => ({
                    doctor: doc,
                    schedule: await SchedulerService.getDoctorScheduleDistinctDays(doc.id, dateStart)
                }))
            );

            res.status(200).json(wrappedDoctors)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async getDoctor (req, res) {
        try {
            const {id} = req.query
            const {dateStart} = req.query
            const doctor = await DoctorService.getDoctorWithPost(id)
            const schedule = await SchedulerService.getDoctorScheduleDistinctDays(doctor.id, dateStart)
            const data = {
                doctor: doctor,
                schedule: schedule
            }

            res.status(200).json(data)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    async getPostsList (req, res) {
        try {
            const posts = await DoctorService.getPosts()
            res.status(200).json(posts)
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    
}

module.exports = new DoctorController();