const { where, Op } = require('sequelize');
const database = require('../models/index');
const { fn, col } = require('sequelize');
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

    async getDoctorScheduleByDates (doctorId, startDate, endDate) {
        try {
            const doctorSchedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    date: {
                        [Op.between]: [startDate, endDate]
                    }, 
                    scheduleStatus: 1,  
                }
            })
            return doctorSchedule;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorScheduleBetweenDays (doctorId, startDate = null, endDate = null) {
        try {
            if (startDate && endDate) {
               const doctorSchedule = await database["Schedule"].findAll({
                    where: {
                        doctorId,
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                }) 
                return doctorSchedule;
            }
            else if (startDate) {
                const doctorSchedule = await database["Schedule"].findAll({
                    where: {
                        doctorId,
                        date: {
                            [Op.gte]: startDate
                        }

                    }
                })
                return doctorSchedule
            }
            else if (endDate) {
                const doctorSchedule = await database["Schedule"].findAll({
                    where: {
                        doctorId,
                        date: {
                            [Op.lte]: endDate
                        }

                    }
                })
                return doctorSchedule
            }
            return null
            

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

    async getDoctorScheduleWithBusySlots(doctorId, startDate = null, endDate = null) {
        try {
            // Условия для поиска расписания
            let scheduleWhere = { doctorId };
            if (startDate && endDate) {
                scheduleWhere.date = { [Op.between]: [startDate, endDate] };
            } else if (startDate) {
                scheduleWhere.date = { [Op.gte]: startDate };
            } else if (endDate) {
                scheduleWhere.date = { [Op.lte]: endDate };
            }

            const schedules = await database["Schedule"].findAll({
                where: scheduleWhere,
                include: [
                    { model: database["WeekDays"], required: false }
                ],
                order: [['date', 'ASC'], ['scheduleStartTime', 'ASC']]
            });

            // Получаем все слоты, которые могут пересекаться
            let slotsWhere = { doctorId, isBusy: true };
            if (startDate && endDate) {
                slotsWhere.slotStartDateTime = { [Op.between]: [startDate, endDate] };
            } else if (startDate) {
                slotsWhere.slotStartDateTime = { [Op.gte]: startDate};
            } else if (endDate) {
                slotsWhere.slotStartDateTime = { [Op.lte]: endDate };
            }

            const busySlots = await database["Slots"].findAll({
                where: slotsWhere
            });

            // Сопоставляем расписание и занятые слоты
            const result = schedules.map(sch => {
            // Приводим дату к YYYY-MM-DD
            const dateStr = moment(sch.date).format("YYYY-MM-DD");

            const schStart = moment.tz(`${dateStr} ${sch.scheduleStartTime}`, "YYYY-MM-DD HH:mm:ss", "UTC");
            const schEnd = moment.tz(`${dateStr} ${sch.scheduleEndTime}`, "YYYY-MM-DD HH:mm:ss", "UTC");


                const intersectingSlots = busySlots.filter(slot => {
                    const slotStart = moment(slot.slotStartDateTime);
                    const slotEnd = moment(slot.slotEndDateTime);
                    return slotStart.isBefore(schEnd) && slotEnd.isAfter(schStart);
                });

                return {
                    ...sch.toJSON(),
                    isBusy: intersectingSlots.length > 0,
                    busySlots: intersectingSlots
                };
            });

            return result;

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getDoctorScheduleDistinctDays(doctorId, startDate = null, endDate = null) {
        try {
            let scheduleWhere = { doctorId };
            if (startDate && endDate) {
                scheduleWhere.date = { [Op.between]: [startDate, endDate] };
            } else if (startDate) {
                scheduleWhere.date = { [Op.gte]: startDate };
            } else if (endDate) {
                scheduleWhere.date = { [Op.lte]: endDate };
            }
            const weekDays = await database["Schedule"].findAll({
                attributes: [[fn('DISTINCT', col('WeekDay.name')), 'name']],
                include: [
                    {
                        model: database["WeekDays"],
                        attributes: []
                    }
                ],
                where: scheduleWhere,
                raw: true
            });

            // Преобразуем в массив строк
            const result = weekDays.map(wd => wd.name);
            return result;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }


}

module.exports = new SchedulerService()