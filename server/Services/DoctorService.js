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
        }
    }

    async getAllDoctors() {
        try {
            const patients = await database.models.Doctors.findAll({
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

    async createDoctor(userId, secondName, firstName, patronomicName, birthDate, info) {
        try {
            const doctor = await database.models.Doctors.create({
                
                userId, secondName, firstName, patronomicName, birthDate, info
            })
            return doctor
      
        }
        catch (e) {
            console.log(e)
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
        }
    }
}

module.exports = new DoctorService();