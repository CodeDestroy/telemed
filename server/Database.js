
const Users = require('./models/users');
const UsersRoles = require('./models/usersroles');
const Doctors = require('./models/doctors');
const Admins = require('./models/admins');
const Patients = require('./models/patients');
const Tokens = require('./models/tokens');
const Rooms = require('./models/rooms');
const Messages = require('./models/messages');

const Files = require('./models/files')
const Url = require('./models/url')
const Settings = require('./models/settings')
const LogTypes = require('./models/logtypes')
const Logs = require('./models/logs')
const Services = require('./models/services')
const Slots = require('./models/slots')
const Payments = require('./models/payments')
const PayTypes = require('./models/paytypes')
const SlotStatus = require('./models/slotstatus')
const ConfirmCodes = require('./models/confirmcodes')
const MedicalOrgs = require('./models/medicalorgs')
const Posts = require('./models/posts')
const API = require('./models/api')
const Schedule = require('./models/schedule')
const WeekDays = require('./models/weekdays')
const UsersRooms = require('./models/usersrooms')
const UsersSettings = require('./models/userssettings')
const { Sequelize, DataTypes } = require('sequelize');

module.exports = class Database {
  constructor(databaseName, username, password, host, dialect, logging) {
    this.sequelize = new Sequelize(
      databaseName,
      username,
      password,
      {
          host: host,
          dialect:
              dialect /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,

          logging: logging
      }
      
    );
    this.models = {
      Users: Users(this.sequelize, DataTypes),
      UsersRoles: UsersRoles(this.sequelize, DataTypes),
      UsersRooms: UsersRooms(this.sequelize, DataTypes),
      UsersSettings: UsersSettings(this.sequelize, DataTypes),
      Doctors: Doctors(this.sequelize, DataTypes),
      Admins: Admins(this.sequelize, DataTypes),
      Patients: Patients(this.sequelize, DataTypes),
      Tokens: Tokens(this.sequelize, DataTypes),
      Rooms: Rooms(this.sequelize, DataTypes),
      Messages: Messages(this.sequelize, DataTypes),
      Files: Files(this.sequelize, DataTypes),
      Url: Url(this.sequelize, DataTypes),
      Settings: Settings(this.sequelize, DataTypes),
      LogTypes: LogTypes(this.sequelize, DataTypes),
      Logs: Logs(this.sequelize, DataTypes),
      Services: Services(this.sequelize, DataTypes),
      Slots: Slots(this.sequelize, DataTypes),
      Payments: Payments(this.sequelize, DataTypes),
      PayTypes: PayTypes(this.sequelize, DataTypes),
      SlotStatus: SlotStatus(this.sequelize, DataTypes),
      ConfirmCodes: ConfirmCodes(this.sequelize, DataTypes),
      MedicalOrgs: MedicalOrgs(this.sequelize, DataTypes),
      Posts: Posts(this.sequelize, DataTypes),
      API: API(this.sequelize, DataTypes),
      Schedule: Schedule(this.sequelize, DataTypes),
      WeekDays: WeekDays(this.sequelize, DataTypes),
    };

    Object.keys(this.models).forEach(modelName => {
      if (this.models[modelName].associate) {
        this.models[modelName].associate(this.models);
      }
    });

    // Установление ассоциаций
    
  }

}

