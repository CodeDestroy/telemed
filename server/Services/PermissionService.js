const { where, Op } = require('sequelize');
const database = require('../Database/setDatabase')
class PermissionService {

    async getPermissionsList() {
        try {
            const permissions = await database.models.Permissions.findAll()
            return permissions
        }
        catch (e) {
            console.log(e);
            throw e
        }
    }

    async getPermissionsByDoctorId(doctorId) {
        try {
            const doctor = await database.models.Doctors.findByPk(doctorId, {
                include: [{ model: database.models.Permissions, as: 'permissions' }]
            })
            return doctor.permissions
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }
}

module.exports = new PermissionService()