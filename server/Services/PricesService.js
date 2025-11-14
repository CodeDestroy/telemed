const { where, Op } = require('sequelize');
const database = require('../Database/setDatabase')
const { fn, col } = require('sequelize');
const moment = require('moment-timezone')
class PricesService {
    async createPrice({scheduleId, price, isFree = false, startDate = null, endDate = null}) {
        try {
            const newPrice = await database.models.SchedulePrices.create({scheduleId, price, isFree, startDate, endDate})
            return newPrice
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async editPrice({scheduleId, price, isFree = false, startDate = null, endDate = null}) {
        try {
            const newPrice = await database.models.SchedulePrices.update(
                { 
                    price, isFree, startDate, endDate
                },
                { 
                    where: { scheduleId: scheduleId } 
                }
            )
            return newPrice
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getPricesByScheduleId(scheduleId) {
        try {
            const today = new Date();
            const prices = await database.models.SchedulePrices.findOne({
                where: {
                    scheduleId,
                    startDate: { [Op.lte]: today },
                    endDate: { [Op.gte]: today }
                }
            })
            return prices
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

}


module.exports = new PricesService()