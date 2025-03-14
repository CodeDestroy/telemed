// controllers/scheduleController.js
const SchedulerService = require('../Services/SchedulerService')
const { Op } = require('sequelize');
const database = require('../models/index');
class SchedulerController {
    // Создание нового временного промежутка для расписания врача
    async createOrUpdateSchedule(req, res) {
        const { doctorId, scheduleDay, scheduleStartTime, scheduleEndTime, scheduleStatus = 1 } = req.body;
        const startTime = ((new Date(scheduleStartTime)).getHours() + 3) + ':' + (new Date(scheduleStartTime)).getMinutes();
        const endTime = ((new Date(scheduleEndTime)).getHours() + 3) + ':' + (new Date(scheduleEndTime)).getMinutes();

        console.log(startTime, endTime)
        try {
            const weekDay = await database["WeekDays"].findOne({
                where: {
                    name: scheduleDay
                }
            })
            // Проверяем пересечения по времени для выбранного дня недели
            const overlappingSchedules = await SchedulerService.findOverlappingSchedules(doctorId, weekDay.id, startTime, endTime)

            if (overlappingSchedules) {
                return res.status(400).json({
                    error: 'Временной промежуток пересекается с существующим расписанием.',
                });
            }

            // Создаем новый временной промежуток для врача
            const newSchedule = await SchedulerService.createSchedule(doctorId, weekDay.id, startTime, endTime, scheduleStatus);

            res.status(201).json(newSchedule);
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

    
    async getDoctorScheduler (req, res) {
        try {
            const {id} = req.params
            const {dayid} = req.query
            const {date} = req.query
            let schedule
            if (!dayid)
                schedule = await SchedulerService.getDoctorSchedule(id)
            else if (date) {
                schedule = await SchedulerService.getDoctorScheduleByDate(id, date)
            }
            else 
                schedule = await SchedulerService.getDoctorScheduleByDay(id, dayid)
            res.status(200).json(schedule)
        }
        catch (e) {
            res.status(404).json({error: e.message})
        }
    }
    

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
}

module.exports = new SchedulerController();



