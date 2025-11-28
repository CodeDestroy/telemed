const { where, Op } = require('sequelize');
const database = require('../models/index');
const { fn, col, literal } = require('sequelize');
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

    async createScheduleDate (doctorId, date, scheduleStartTime, scheduleEndTime, scheduleDay, scheduleStatus = 1, scheduleServiceTypeId = 1) {
        try {
            const newSchedule = await database["Schedule"].create({
                doctorId,
                date: date,
                scheduleStartTime,
                scheduleEndTime,
                scheduleStatus,
                scheduleDayId: scheduleDay,
                scheduleServiceTypeId
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
            const newSlot = await database["Schedule"].findOne({
                where: { id: slotId } 
            })
            newSlot.date = date
            newSlot.scheduleStartTime = scheduleStartTime
            newSlot.scheduleEndTime = scheduleEndTime
            newSlot.scheduleDayId = scheduleDay
            newSlot.scheduleStatus = scheduleStatus
            await newSlot.save()
            /* const newslot = await database["Schedule"].update(
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
            ) */
                
            return newSlot
        }
        catch (e) {
            console.log(e)
            throw e;
        }
    }

    async getDoctorScheduleByDate (doctorId, date, serviceId) {
        try {
            const doctorSchedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    date: {
                        [Op.eq]: date
                    },
                    /* date: {[Op.ne]: null}, */
                    scheduleStatus: 1,
                    scheduleServiceTypeId: serviceId ? serviceId : 1

                },
                include: [
                    { 
                        model: database["WeekDays"],
                        required: true ,
                    },
                    {
                        model: database["SchedulePrices"],
                        required: true
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

    async getDoctorScheduleByDateTime (doctorId, date, time) {
        try {
            const doctorSchedule = await database["Schedule"].findOne({
                where: {
                    doctorId,
                    date: {
                        [Op.eq]: date
                    },
                    scheduleStartTime: { [Op.lte]: time },
                    scheduleEndTime: { [Op.gte]: time },
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
                    },
                    include: [
                        {
                            model: database["SchedulePrices"],
                            required: true
                        },
                        {
                            model: database['Services'],
                            required: true,
                        }
                    ]
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

                    },
                    include: [
                        {
                            model: database["SchedulePrices"],
                            required: true
                        },
                        {
                            model: database['Services'],
                            required: true,
                        }
                    ]
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

                    },
                    include: [
                        {
                            model: database["SchedulePrices"],
                            required: true
                        },
                        {
                            model: database['Services'],
                            required: true,
                        }
                    ]
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

    async getDoctorSchedule (doctorId, serviceId) {
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
                            date: null,
                            scheduleServiceTypeId: serviceId ? serviceId : 1
                        },
                        include: [
                            { 
                                model: database["WeekDays"],
                                required: true 
                            },
                            {
                                model: database["SchedulePrices"],
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
                            },
                            scheduleServiceTypeId: serviceId ? serviceId : 1
                        },
                        include: [
                            { 
                                model: database["WeekDays"],
                                required: true 
                            },
                            {
                                model: database["SchedulePrices"],
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

    async getDoctorScheduleByDay (doctorId, dayId, serviceId) {
        try {
            const schedule = await database["Schedule"].findAll({
                where: {
                    doctorId,
                    date: {[Op.eq]: null},
                    scheduleServiceTypeId: serviceId ? serviceId : 1
                },
                include: [
                    { 
                        model: database["WeekDays"],
                        required: true ,
                        where: {
                            id: dayId
                        }
                    },
                    {
                        model: database["SchedulePrices"],
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

    async getDoctorScheduleDistinctDays(doctorId, startDate = null, endDate = null, serviceId) {
        try {
            let scheduleWhere = { doctorId };
            
            if (startDate && endDate) {
                scheduleWhere.date = { [Op.between]: [startDate, endDate] };
            } else if (startDate) {
                scheduleWhere.date = { [Op.gte]: startDate };
            } else if (endDate) {
                scheduleWhere.date = { [Op.lte]: endDate };
            }
            scheduleWhere.scheduleStatus = 1
            if (serviceId)
                scheduleWhere.scheduleServiceTypeId = serviceId
            // время начала слота не раньше чем через 2 часа 
            /* if (startDate) {
                const twoHoursLater = new Date(new Date(startDate).getTime() + 2 * 60 * 60 * 1000);
                const formatted = twoHoursLater.toISOString().slice(0, 19).replace('T', ' ');

                scheduleWhere[Op.and] = [
                    literal(`TIMESTAMP(CONCAT(date, ' ', scheduleStartTime)) >= '${formatted}'`)
                ];
            } */
            const weekDays = await database["Schedule"].findAll({
                attributes: [
                    [fn('DISTINCT', col('date')), 'date'], // Уникальные даты
                    [col('WeekDay.name'), 'name'],
                ],
                include: [
                    {
                        model: database["WeekDays"],
                        attributes: []
                    }
                ],
                where: scheduleWhere,
                group: ['WeekDay.name', 'Schedule.date'],
                /* order: [[database["WeekDays"], 'id', 'ASC']], */
                order: [['date', 'ASC']],
                raw: true
            });

            // Преобразуем в массив строк
            /* const result = weekDays.map(wd => wd.name); */
            return weekDays;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getDoctorScheduleMinPrice(doctorId, startDate, serviceId) {
        try {
            const replacements = { startDate, serviceId, doctorId };
            const sql = `
                SELECT MIN(sp.price) AS minPrice
                from "Doctors" d 
                join "Schedules" s on s."doctorId" = d.id 
                join "SchedulePrices" sp on sp."scheduleId" = s.id 
                WHERE s.date >= :startDate
                    AND s."scheduleStatus" = 1
                    AND s."scheduleServiceTypeId" = :serviceId
                    AND d.id = :doctorId
            `;

            const [rows] = await database.sequelize.query(sql, { replacements, type: database.sequelize.QueryTypes.SELECT });
            const minPrice = rows?.minprice ?? null;
            
            

            // Преобразуем в массив строк
            /* const result = weekDays.map(wd => wd.name); */
            return minPrice;
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getSchedulerById(scheduleId) {
        try {
            const schedule = await database["Schedule"].findByPk(scheduleId, {
                include: [
                    { model: database["WeekDays"], required: false },
                    { model: database['SchedulePrices'], required: true }
                ],
            });
            return schedule
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }


    async getSchedulerBySlotId(slotId) {
        try {
            const schedule = await database["Schedule"].findOne({
                where: {
                    slotId
                },
                include: [
                    { model: database["WeekDays"], required: false },
                    { model: database['SchedulePrices'], required: true }
                ],
            });
            return schedule
        }
        catch (e) {
            
            console.log(e)
            throw e
        }
    }


}

module.exports = new SchedulerService()