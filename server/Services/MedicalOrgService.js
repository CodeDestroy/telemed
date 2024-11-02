const database = require('../Database/setDatabase');
const { Op, literal, or } = require('sequelize');
const moment = require('moment-timezone')
class MedicalOrgService {
    async getMedOrgByUserId(id) {
        try {
            const medorg = await database.models.MedicalOrgs.findOne({
                include: [
                    {
                        model: database.models.Admins,
                        as: 'admins',
                        required: true,
                    },
                    {
                        model: database.models.Doctors,
                        as: 'doctors',
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