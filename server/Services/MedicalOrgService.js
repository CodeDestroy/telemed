const database = require('../models/index');
const { Op, literal, or } = require('sequelize');
const moment = require('moment-timezone');
const AdminService = require('./AdminService');
class MedicalOrgService {
    async getMedOrgByUserId(id) {
        try {
            const user = await database["Users"].findByPk(id, {
                include: [
                    {
                        model: database["Admins"],
                        required: true,
                    }
                ],}
            )

            let medOrgId = 1;
            if (user.Admin.medOrgId) {
                medOrgId = user.Admin.medOrgId;
            }

            const medorg = await database["MedicalOrgs"].findByPk(medOrgId , {
                include: [
                    {
                        model: database["Admins"],
                        required: true,
                    },
                    {
                        model: database["Doctors"],
                        required: true,
                    }
                ],

            })
            return medorg
        }
        catch (e) {
            console.log(e)
            throw 3
        }
    }

    async getMedOrgByAdminId(adminId) {
        try {
            const admin = await AdminService.getAdmin(adminId);
            let medOrgId = 1;
            if (admin.medOrgId) {
                medOrgId = admin.medOrgId;
            }
            const medorg = await database["MedicalOrgs"].findByPk(medOrgId , {
                include: [
                    {
                        model: database["Admins"],
                        required: true,
                    },
                    {
                        model: database["Doctors"],
                        required: true,
                    }
                ],

            })
            return medorg
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = new MedicalOrgService();