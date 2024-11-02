const { where } = require('sequelize');
const database = require('../Database/setDatabase');
class DoctorService {
    async getDoctorByUserId(userId) {
        try {
            const doctor = await database.models.Doctors.findOne({
                where: {
                    userId: userId
                }
            })
            return doctor;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getAllDoctors() {
        try {
            const doctors = await database.models.Doctors.findAll({
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctors;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getAllDoctorsInMO(medorgId) {
        try {
            const doctors = await database.models.Doctors.findAll({
                where: {
                    medOrgId: medorgId
                },
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctors
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async createDoctor(userId, secondName, firstName, patronomicName, birthDate, info, snils = null, medOrgId = null) {
        try {
            const doctor = await database.models.Doctors.create({
                
                userId, secondName, firstName, patronomicName, birthDate, info, snils, medOrgId
            })
            return doctor
      
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctor(id) {
        try {
            const doctor = await database.models.Doctors.findByPk(id, {
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctor;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorsByFIO(secondName, name, patronomicName) {
        try {
            const doctor = await database.models.Doctors.findAll({
                where: {
                    secondName: secondName,
                    firstName: name,
                    patronomicName: patronomicName
                },
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctor
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    /* async getDoctorByInn (inn) {
        try {
            const doctor = await database.models.Doctors.findOne({
                where: {
                    inn: inn,
                },
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctor
        }
        catch (e) {
            console.log(e)
        }
    } */

    async getDoctorBySnils (snils) {
        try {
            const doctor = await database.models.Doctors.findOne({
                where: {
                    snils: snils,
                },
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return doctor
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = new DoctorService();