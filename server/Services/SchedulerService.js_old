const { where, Op } = require('sequelize');
const database = require('../models/index');

const moment = require('moment-timezone')
class SchedulerService {
    async findOverlappingSchedules (doctorId, scheduleDay, scheduleStartTime, scheduleEndTime) {
        try {
            const overlappingSchedules = await database["Schedule"].findOne({
                where: {
                    doctorId,
                    scheduleDayId: scheduleDay,
                    [Op.or]: [
                        {
                        scheduleStartTime: {
                            [Op.lt]: scheduleEndTime,
                        },
                        scheduleEndTime: {
                            [Op.gt]: scheduleStartTime,
                        },
                        },
                    ],
                },
            });
            return overlappingSchedules
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }

    async createSchedule (doctorId, scheduleDay, scheduleStartTime, scheduleEndTime, scheduleStatus = 1) {
        try {
            const newSchedule = await database["Schedule"].create({
                doctorId,
                scheduleDayId: scheduleDay,
                scheduleStartTime,
                scheduleEndTime,
                scheduleStatus,
            });
            return newSchedule
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }

    async getDoctorScheduleByDay (doctorId, dayOfWeek) {
        try {
            const doctorSchedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    scheduleDay: dayOfWeek,
                    scheduleStatus: 1,
                },
            });
            return doctorSchedule
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }

    async getDoctorSchedule (doctorId) {
        try {
            const schedule = await database["Schedule"].findAll({
                where: {
                    doctorId
                },
                include: [
                    { 
                        model: database["WeekDays"],
                        required: true 
                    }
                ],
                order: [['scheduleDayId', 'ASC'], ['scheduleStartTime', 'ASC']]
            })
            return schedule
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorScheduleByDay (doctorId, dayId) {
        try {
            const schedule = await database["Schedule"].findAll({
                where: {
                    doctorId
                },
                include: [
                    { 
                        model: database["WeekDays"],
                        required: true ,
                        where: {
                            id: dayId
                        }
                    }
                ],
                order: [['scheduleDayId', 'ASC'], ['scheduleStartTime', 'ASC']]
            })
            return schedule
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async deleteDoctorSchedule (id) {
        try {
            const schedule = await database["Schedule"].destroy({
                where: {
                    id
                }
            })
            return schedule
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

}

module.exports = new SchedulerService()