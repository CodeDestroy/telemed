const cron = require("node-cron");
const database = require('../Database/setDatabase')
const dayjs = require("dayjs");

const { Op } = require('sequelize')
const checkExpiredPayments = () => {
  // Запускаем cron каждые 1 минуту
  cron.schedule("* * * * *", async () => {
    try {
      const now = dayjs();
      // Находим платежи в ожидании (status 1), где прошло >20 минут
      const expiredPayments = await database.models.Payments.findAll({
        where: {
          paymentStatusId: 1,
          createdAt: {
            [Op.lt]: now.subtract(20, "minute").toDate(), // <-- теперь Op правильно
          },
        },
      });

      if (expiredPayments.length > 0) {
        for (const payment of expiredPayments) {
          const slot = await database.models.Slots.findByPk(payment.slotId)
          const room = await database.models.Rooms.findOne({
            where: {slotId: slot.id}
          })
          room.roomName = room.roomName + '_cancel_' + payment.id
          slot.slotStatusId = 5;
          payment.paymentStatusId = 5; // Отмена оплаты
          await room.save();
          await payment.save();
          await slot.save();
          console.log(`Payment ${payment.id} просрочен и отменён`);
        }
      }
    } catch (error) {
      console.error("Ошибка проверки просроченных платежей:", error);
    }
  });
};

module.exports = checkExpiredPayments;
