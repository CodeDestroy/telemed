const database = require('../models/index');
const { Op, literal, or } = require('sequelize');
const moment = require('moment-timezone')
class MedicalOrgService {
    async getMedOrgByUserId(id) {
        try {
            const medorg = await database["MedicalOrgs"].findOne({
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
                /* where: {
                    [Op.or]: [
                        {'$Admins.userId$' : id},
                        {'$Doctors.userId$' : id}
                    ]
                }, */
            })
            return medorg
        }
        catch (e) {
            console.log(e)
            throw 3
        }
    }
}

module.exports = new MedicalOrgService();