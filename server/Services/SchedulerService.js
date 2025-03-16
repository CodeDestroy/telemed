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
    

    async findOverlappingSchedulesDates (doctorId, date, scheduleStartTime, scheduleEndTime, slotId = null) {
        try {
            if (slotId) {
                
                console.log(doctorId, date, scheduleStartTime, scheduleEndTime, slotId)
                const overlappingSchedules = await database["Schedule"].findOne({
                    where: {
                        doctorId,
                        date: date,
                        id: {[Op.ne]: slotId},
                        /* [Op.ne]: {
                            id: slotId
                        }, */
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
                console.log(overlappingSchedules)
                return overlappingSchedules
            }
            else {
                const overlappingSchedules = await database["Schedule"].findOne({
                    where: {
                        doctorId,
                        date: date,
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

    async createScheduleDate (doctorId, date, scheduleStartTime, scheduleEndTime, scheduleDay, scheduleStatus = 1) {
        try {
            const newSchedule = await database["Schedule"].create({
                doctorId,
                date: date,
                scheduleStartTime,
                scheduleEndTime,
                scheduleStatus,
                scheduleDayId: scheduleDay,
            });
            return newSchedule
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }

    async editScheduleDate (slotId, date, scheduleStartTime, scheduleEndTime, scheduleDay, scheduleStatus) {
        try {
            const newslot = await database["Schedule"].update(
                { 
                    date,
                    scheduleStartTime,
                    scheduleEndTime,
                    scheduleStatus,
                    scheduleDayId: scheduleDay,
                },
                { 
                    where: { id: slotId } 
                }
            )
                
            return newslot
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }


    /* async getDoctorScheduleByDay (doctorId, dayOfWeek) {
        try {
            const doctorSchedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    scheduleDay: dayOfWeek,
                    date: {[Op.eq]: null},
                    scheduleStatus: 1,
                },
            });
            return doctorSchedule
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    } */

    async getDoctorScheduleByDate (doctorId, date) {
        try {
            const doctorSchedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    date: {
                        [Op.eq]: date
                    },
                    /* date: {[Op.ne]: null}, */
                    scheduleStatus: 1,

                },
                include: [
                    { 
                        model: database["WeekDays"],
                        required: true ,
                    }
                ],
            })
            return doctorSchedule
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorSchedule (doctorId) {
        try {
            const doctor = await database["Doctors"].findByPk(doctorId, {
                include: [{
                    model: database["Users"],
                    required: true
                }]
            })
            let schedule = null
            switch (doctor.User.schedulerType) {
                case "weekDay": 
                    schedule = await database["Schedule"].findAll({
                        where: {
                            doctorId,
                            date: null
                        },
                        include: [
                            { 
                                model: database["WeekDays"],
                                required: true 
                            }
                        ],
                        order: [['scheduleDayId', 'ASC'], ['scheduleStartTime', 'ASC']]
                    })
                    break
                case "dates":
                    schedule = await database["Schedule"].findAll({
                        where: {
                            doctorId,
                            date: {
                                [Op.ne]: null
                            }
                        },
                        include: [
                            { 
                                model: database["WeekDays"],
                                required: true 
                            }
                        ],
                        order: [['scheduleDayId', 'ASC'], ['scheduleStartTime', 'ASC']]
                    })
                    break
                default:
                    throw new Error("Неизвестный тип расписания")

            }
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
                    doctorId,
                    date: {[Op.eq]: null},
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