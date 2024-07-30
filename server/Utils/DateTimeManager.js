const moment = require('moment-timezone');
const timeZones = {
    3: 'Europe/Moscow',
}
class DateTimeManager {

    

    async getDateTimeWithTimezone(time, timezone) {
        const timeZone = timeZones[timezone];

        // Получаем текущую дату и время в заданном часовом поясе
        
        
        // Или создаем даты с использованием moment-timezone
        const result = moment.tz(time, timeZone).toDate();

        return result
    }

    async getCurrentDateTimeWithTimezone (timezone) {
        const timeZone = timeZones[timezone];
        const currentDateTime = moment.tz(new Date(), timeZone).toDate();
        return currentDateTime
    }

    async parseDateFromRussian(dateStr) {
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day);
    }



}

module.exports = new DateTimeManager();