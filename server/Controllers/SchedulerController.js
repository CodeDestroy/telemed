// controllers/scheduleController.js
const SchedulerService = require('../Services/SchedulerService')
const { Op } = require('sequelize');
const database = require('../models/index');
const PricesService = require('../Services/PricesService');
const moment = require('moment-timezone')
class SchedulerController {
    // Создание нового временного промежутка для расписания врача
    async createOrUpdateSchedule(req, res) {
        const { doctorId, scheduleDay, scheduleStartTime, scheduleEndTime, scheduleStatus = 1, slotDuration, slotsCount } = req.body;

        try {
            const weekDay = await database["WeekDays"].findOne({
                where: {
                    name: scheduleDay
                }
            })
            for (let i = 0; i < slotsCount; i++) {
                const startTime = moment(scheduleStartTime).add(slotDuration*i);
                const endTime = moment(scheduleStartTime).add(slotDuration*(i+1));
                // Проверяем пересечения по времени для выбранного дня недели
                const overlappingSchedules = await SchedulerService.findOverlappingSchedules(doctorId, weekDay.id, startTime, endTime)

                if (overlappingSchedules) {
                    return res.status(400).json({
                        error: 'Временной промежуток пересекается с существующим расписанием.',
                    });
                }

                // Создаем новый временной промежуток для врача
                const newSchedule = await SchedulerService.createSchedule(doctorId, weekDay.id, startTime, endTime, scheduleStatus);
                console.log('createOrUpdateSchedule')
            }
            

            res.status(201).send('Успешно');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
        

        
    }

    async setScheduleType (req, res) {
        try {
            const {type, userId} = req.body;
            const user = await database["Users"].findOne({where: {id: userId}})
            switch (type) {
                case 'byDate':
                    user.schedulerType = 'byDate';
                    break;
                case 'daysOfWeek':
                    user.schedulerType = 'daysOfWeek';
                    break;
                
            }
            user.save();
            res.status(200).json(user);
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    //Не используется
    async getAvailableSlots(req, res) {
        const { doctorId, date, slotDuration } = req.query;
        
        try {
            const dayOfWeek = new Date(date).getDay();
        
            // Получаем расписание врача для указанного дня недели
            const doctorSchedule = await SchedulerService.getDoctorScheduleByDay(doctorId, dayOfWeek);
        
            if (!doctorSchedule || doctorSchedule.length === 0) {
                return res.status(404).json({ error: 'Для выбранного врача нет расписания на этот день.' });
            }
        
            // Получаем занятые слоты (существующие консультации) для выбранной даты
            const occupiedSlots = await Consultation.findAll({
                where: {
                    doctorId,
                    date,
                },
                attributes: ['startTime', 'endTime'],
            });
        
            // Формируем доступные слоты
            const availableSlots = [];
            doctorSchedule.forEach((schedule) => {
                let slotStartTime = schedule.scheduleStartTime;
                const endTime = schedule.scheduleEndTime;
        
                while (slotStartTime < endTime) {
                const slotEndTime = addMinutes(slotStartTime, slotDuration);
        
                // Проверяем, что текущий слот не пересекается с занятыми слотами
                const isOccupied = occupiedSlots.some((slot) => {
                    return (
                    (slot.startTime < slotEndTime) &&
                    (slot.endTime > slotStartTime)
                    );
                });
        
                if (!isOccupied && slotEndTime <= endTime) {
                    availableSlots.push({ startTime: slotStartTime, endTime: slotEndTime });
                }
        
                // Переходим к следующему слоту
                slotStartTime = slotEndTime;
                }
            });
        
            res.status(200).json(availableSlots);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка сервера.' });
        }
    }
    
    // Функция для добавления минут к времени не используется
    addMinutes(time, minutes) {
        const [hour, minute] = time.split(':').map(Number);
        const newDate = new Date(1970, 0, 1, hour, minute + minutes);
        const newHour = String(newDate.getHours()).padStart(2, '0');
        const newMinute = String(newDate.getMinutes()).padStart(2, '0');
        return `${newHour}:${newMinute}`;
    }

    async getDoctorSchedulerDate (req, res) {
        try {
            const {id} = req.params
            const {date} = req.query
            const {dayid} = req.query
            const {serviceId} = req.query
            let schedule
            if (!dayid && !date) {

                schedule = await SchedulerService.getDoctorSchedule(id, parseInt(serviceId))
            }
            else if (!dayid && date) {
                schedule = await SchedulerService.getDoctorScheduleByDate(id, date, parseInt(serviceId))
            }
            else if (dayid && !date) {

                schedule = await SchedulerService.getDoctorScheduleByDay(id, dayid, parseInt(serviceId))
            }
            else {
                throw new Error('Не указано ни дата, ни день недели.')
            }
            res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }

    }
    
    async getDoctorScheduler (req, res) {
        try {
            const {id} = req.params
            const {startDate} = req.query
            const {endDate} = req.query
            const schedule = await SchedulerService.getDoctorScheduleBetweenDays(id, startDate, endDate)
            return res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }

    async getDoctorSchedulerById(req, res) {
        try {
            const {id} = req.params
            const schedule = await SchedulerService.getDoctorScheduleById(id)
            return res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }
    
    /* async getDoctorSchedulerDate (req, res) {
        try {
            const {id} = req.params
            const {dayid} = req.query
            const {date} = req.query
            const {startDate} = req.query
            const {endDate} = req.query
            let schedule
            if (dayid)
                schedule = await SchedulerService.getDoctorScheduleByDay(id, dayid)
            else if (date) {
                schedule = await SchedulerService.getDoctorScheduleByDate(id, date)
            }
            else if (startDate && endDate) {
                schedule = await SchedulerService.getDoctorScheduleByDates(id, startDate, endDate)
            }
            else 
                schedule = await SchedulerService.getDoctorSchedule(id)
            res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    } */

    async deleteDoctorScheduler (req, res) {
        try {
            const {id} = req.body
            const schedule = await SchedulerService.deleteDoctorSchedule(id)
            return res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }
/* 
http://localhost:8080/api/doctor/scheduler/14?startDate=Fri,+28+Feb+2025+21:00:00+GMT&endDate=Sun,+30+Mar+2025+21:00:00+GMT
http://localhost:8080/api/doctor/scheduler/4?startDate=Fri,+28+Feb+2025+21:00:00+GMT&endDate=Sun,+30+Mar+2025+21:00:00+GMT */
    async addScheduleDate(req, res) {
        try {
            const { doctorId, date, startTime, endTime, price, isFree, slotDuration, slotsCount, serviceId } = req.body;
            // Приведение исходных данных к нормальному виду
            const inputDate = new Date(date); // Получаем чистый объект даты
            const inputStartTime = moment(`${inputDate.toISOString().split('T')[0]}T${startTime}`, 'YYYY-MM-DDTHH:mm').toDate();
            const inputSlotDuration = parseInt(slotDuration, 10); // Парсим duration в число минут
            const totalSlots = parseInt(slotsCount, 10);          // Общее количество слотов
            
            // Основной цикл создания расписания
            for (let i = 0; i < totalSlots; i++) {
                const currentStart = moment(inputStartTime).add(i * inputSlotDuration, 'minutes');
                const currentEnd = moment(currentStart).add(inputSlotDuration, 'minutes');
                // Проверка на пересечения
                const overlappingSchedules = await SchedulerService.findOverlappingSchedulesDates(
                    doctorId,
                    date,
                    currentStart.format('YYYY-MM-DD HH:mm'),
                    currentEnd.format('YYYY-MM-DD HH:mm')
                );



                if (overlappingSchedules) {
                    return res.status(400).json({
                        error: 'Временной промежуток пересекается с существующим расписанием.'
                    });
                }

                // Создание расписания
                const newSchedule = await SchedulerService.createScheduleDate(
                    doctorId,
                    date,
                    currentStart.format('YYYY-MM-DD HH:mm'),
                    currentEnd.format('YYYY-MM-DD HH:mm'),
                    inputDate.getDay(),
                    1, // Status by default
                    serviceId
                );

                const aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                const newPrice = await PricesService.createPrice({scheduleId: newSchedule.id, price, isFree, startDate: new Date(), endDate: aYearFromNow})

                /* console.log("Создано новое расписание:", newSchedule); */
            }

            return res.status(200).send('Расписание успешно создано.');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    async editScheduleDate (req, res) {
        try {
            const slotData = req.body;
            const { id } = req.params
            const { doctorId, date, startTime, endTime, scheduleStatus = 1, price, isFree } = req.body;
            const newDate = new Date(date)
            const day = newDate.getDay()
            
            const overlappingSchedules = await SchedulerService.findOverlappingSchedulesDates(doctorId, slotData.date, startTime, endTime, id)
            if (overlappingSchedules) {
                return res.status(400).json({
                    error: 'Временной промежуток пересекается с существующим расписанием.',
                });
            }
            const newSchedule = await SchedulerService.editScheduleDate(id, date, startTime, endTime, day, scheduleStatus);
            const aYearFromNow = new Date();
            aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
            const newPrice = await PricesService.editPrice({scheduleId: newSchedule.id, price, isFree, startDate: new Date(), endDate: aYearFromNow})
            return res.status(200).json(newSchedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }

    async deleteScheduleDate (req, res) {
        try {
            const {id} = req.params

        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }

    

}

module.exports = new SchedulerController();



