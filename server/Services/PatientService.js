const database = require('../models/index');
const moment = require('moment-timezone')
class PatientService {
    async getAllPatients() {
        try {
            const patients = await database["Patients"].findAll({
                include: [{
                    model: database["Users"],
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
            const patient = await database["Patients"].findByPk(id, {
                include: [{
                    model: database["Users"],
                    required: true
                }]
            })
            return patient;
        }
        catch (e) {
            console.log(e)
        }
    }

    async getPatientByUserId(id) {
        try {
            const patient = await database["Patients"].findOne({
                include: [{
                    model: database["Users"],
                    where: { id: id },
                    required: true
                }]
            })
            /* const patient = await database["Patients"].findByPk(id, {
                include: [{
                    model: database["Users"],
                    required: true
                }]
            }) */
            return patient;
        }
        catch (e) {
            console.log(e)
        }
    }
    //newUser.id, secondName, name, patrinomicName, phone, email, password, formattedDate, info
    async createPatient(userId, secondName, firstName, patronomicName, birthDate, info, snils = '') {
        try {
            const patient = await database["Patients"].create({
                
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