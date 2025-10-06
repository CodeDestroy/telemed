const { where } = require('sequelize');
const database = require('../models/index');
class DoctorService {
    async getDoctorByUserId(userId) {
        try {
            const doctor = await database["Doctors"].findOne({
                where: {
                    userId: userId
                },
                
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
            const doctors = await database["Doctors"].findAll({
                include: [
                    {
                        model: database["Users"],
                        required: true
                    },
                    {
                        model: database["Posts"],
                        required: true,
                        through: { attributes: [] }
                    }
                ]
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
                include: [
                    {
                        model: database["Users"],
                        required: true
                    },
                    {
                        model: database["Posts"],
                        required: true,
                        through: { attributes: [] }
                    }
                ]
            })
            return doctors
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async createDoctor(userId, secondName, firstName, patronomicName, birthDate, info, snils = null, medOrgId = null, postIds = 2) {
        try {
            // Создаем доктора без привязки к постам
            const doctor = await database["Doctors"].create({
                userId,
                secondName,
                firstName,
                patronomicName,
                birthDate,
                info,
                snils,
                medOrgId
            });

            // Универсальная обработка postIds
            let postIdsArray = [];
            if (Array.isArray(postIds)) {
                postIdsArray = postIds.map(id => parseInt(id, 10));
            } else if (postIds) {
                postIdsArray = [parseInt(postIds, 10)];
            }

            // Если есть postIds, создаем связи в DoctorPosts
            if (postIdsArray.length > 0) {
                const postLinks = postIdsArray.map(postId => ({
                    doctorId: doctor.id,
                    postId
                }));
                await database["DoctorPosts"].bulkCreate(postLinks);
            }

            return doctor;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    async getDoctor(id) {
        try {
            const doctor = await database["Doctors"].findByPk(id, {
                include: [
                    {
                        model: database["Users"],
                        required: true
                    },
                    {
                        model: database["Posts"],
                        required: true,
                    }
                ]
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
            const doctor = await database["Doctors"].findAll({
                where: {
                    secondName: secondName,
                    firstName: name,
                    patronomicName: patronomicName
                },
                include: [{
                    model: database["Users"],
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
            const doctor = await database["Doctors.findOne({
                where: {
                    inn: inn,
                },
                include: [{
                    model: database["Users,
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
            const doctor = await database["Doctors"].findOne({
                where: {
                    snils: snils,
                },
                include: [{
                    model: database["Users"],
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

    async getDoctorsWithPosts () {
        try {
            const doctors = await database["Doctors"].findAll({
                include: [
                    {
                        model: database["Posts"],
                        required: true,
                        through: { attributes: [] }
                    },
                    {
                        model: database["MedicalOrgs"],
                        required: true
                    }
                ]
            })
            return doctors
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorsWithPostsByMedOrgId (medOrgId) {
        try {
            const doctors = await database["Doctors"].findAll({
                include: [
                    {
                        model: database["Posts"],
                        required: true,
                        through: { attributes: [] }
                    },
                    {
                        model: database["MedicalOrgs"],
                        required: true,
                        where: {
                            id: medOrgId
                        }
                    },
                    {
                        model: database["Users"],
                        required: true
                    }
                ]
            })
            return doctors
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorWithPost(doctorId) {
        try {
            const doctor = await database["Doctors"].findByPk(doctorId, {
                include: [
                    {
                        model: database["Posts"],
                        required: true,
                        through: { attributes: [] }
                    },
                    {
                        model: database["MedicalOrgs"],
                        required: true
                    },
                    {
                        model: database["Users"],
                        required: true
                    }
                ]
            })
            return doctor
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getPosts () {
        try {
            const posts = await database["Posts"].findAll({
            })
            return posts
        }
        catch {
            console.log(e)
            throw e
        }
    }
    async updateDoctorPosts(doctorId, postIds) {
        // Преобразуем id в числа
        const ids = postIds.map(id => parseInt(id, 10));

        // Удаляем связи, которых нет в новом списке
        await database['DoctorPosts'].destroy({
            where: {
                doctorId,
                postId: { [Sequelize.Op.notIn]: ids }
            }
        });

        // Находим текущие связи
        const existingLinks = await database['DoctorPosts'].findAll({
            where: { doctorId }
        });
        const existingPostIds = existingLinks.map(link => link.postId);

        // Создаём только новые связи
        const newLinks = ids
            .filter(id => !existingPostIds.includes(id))
            .map(postId => ({ doctorId, postId }));

        if (newLinks.length > 0) {
            await database['DoctorPosts'].bulkCreate(newLinks);
        }
    }
}

module.exports = new DoctorService();