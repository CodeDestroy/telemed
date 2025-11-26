'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payments.belongsTo(models.Users, { foreignKey: 'userId' });
      Payments.belongsTo(models.PayTypes, { foreignKey: 'payTypeId' });
      Payments.belongsTo(models.PaymentStatus, { foreignKey: 'paymentStatusId' });
      Payments.belongsTo(models.Slots, { foreignKey: 'slotId' });
    }
  }
  Payments.init({
    userId: DataTypes.INTEGER,
    payTypeId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    slotId: DataTypes.INTEGER,
    paymentDetails: DataTypes.TEXT,
    uuid4: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // автоматически генерируется
      },
    paymentStatusId: DataTypes.INTEGER,
    yookassa_id: DataTypes.STRING,
    yookassa_status: DataTypes.STRING,
    yookassa_payment_method_type: DataTypes.STRING,
    yookassa_confirmation_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payments',
  });
  return Payments;
};