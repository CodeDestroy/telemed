const database = require('../Database/setDatabase');
const moment = require('moment-timezone')
class PatientService {
    async getAllPatients() {
        try {
            const patients = await database.models.Patients.findAll({
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return patients;
        }
        catch (e) {
            console.log(e)
        }
    }

    async getPatient(id) {
        try {
            const patient = await database.models.Patients.findByPk(id, {
                include: [{
                    model: database.models.Users,
                    required: true
                }]
            })
            return patient;
        }
        catch (e) {
            console.log(e)
        }
    }
    //newUser.id, secondName, name, patrinomicName, phone, email, password, formattedDate, info
    async createPatient(userId, secondName, firstName, patronomicName, birthDate, info, snils = null) {
        try {
            const patient = await database.models.Patients.create({
                
                userId, secondName, firstName, patronomicName, birthDate, snils, info
            })
            return patient
      
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }
}

module.exports = new PatientService();