const { where } = require('sequelize');
const database = require('../models/index');
class AdminService {
    async getAdminByUserId(userId) {
        try {
            const doctor = await database["Admins"].findAll({
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

    /* async getAllDoctors() {
        try {
            const doctors = await database["Doctors"].findAll({
                include: [{
                    model: database["Users"],
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
            const doctors = await database["Doctors"].findAll({
                where: {
                    medOrgId: medorgId
                },
                include: [{
                    model: database["Users"],
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
            const doctor = await database["Doctors"].create({
                
                userId, secondName, firstName, patronomicName, birthDate, info, snils, medOrgId
            })
            return doctor
      
        }
        catch (e) {
            console.log(e)
            throw e
        }
    } */

    async getAdmin(id) {
        try {
            const admin = await database["Admins"].findByPk(id, {
                include: [{
                    model: database["Users"],
                    required: true
                }]
            })
            return admin;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

}

module.exports = new AdminService();