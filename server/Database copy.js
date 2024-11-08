const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { watchOptions } = require('nodemon/lib/config/defaults');
const UserManager = require('./Utils/UserManager');
const SECOND = 100;
const MINUTE = SECOND * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const moment = require('moment-timezone')
const ALPHABET = process.env.NANOID_ALPHABET;
const JITSI_SECRET = process.env.JITSI_SECRET;
const JITSI_APP_ID = process.env.JITSI_APP_ID;
const JITSI_SERVER_URL = process.env.JITSI_SERVER_URL;
const jwt = require('jsonwebtoken');

Date.prototype.addMinutes = function(m) {
  this.setTime(this.getTime() + (m*MINUTE));
  return this;
}
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*HOUR));
  return this;
}
Date.prototype.addDays = function(d) {
  this.setTime(this.getTime() + (d*DAY));
  return this;
}

module.exports = class Database {
  constructor(databaseName, username, password, host, options = {}) {
    this.sequelize = new Sequelize(
      databaseName,
      username,
      password,
      {
          host: host,
          dialect:
              'postgres' /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,

          logging: false
      }
      
    );
    this.models = {};
    this.defineModels();
    this.defineAssociations();
  }


  defineModels() {

    //Модель токенов
  this.models.Tokens = this.sequelize.define('token', {
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  // Модель Пользователей, они же Users
  this.models.Users = this.sequelize.define('user', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: `${process.env.SERVER_URL}images/defaultAvatar.png`
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    confirmCode: {
      type: DataTypes.TEXT,
    }
  }, {
    timestamps: false
  });

  this.models.ConfirmCodes = this.sequelize.define('confirm_code', {
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  // Модель Пользователей, они же Users
  this.models.UsersRoles = this.sequelize.define('users_role', {
    roleName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    // Другие поля модели User
  }, {
    timestamps: false
  });
  this.models.Doctors = this.sequelize.define('doctor', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronomicName: {
      type: DataTypes.STRING
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    snils: {
      type: DataTypes.STRING,
      allowNull: true
    },
    medOrgId: {
      type: DataTypes.INTEGER,
    },
    postId: {
      type: DataTypes.INTEGER,
    },
    info: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })

  this.models.Admins = this.sequelize.define('admin', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronomicName: {
      type: DataTypes.STRING
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    medOrgId: {
      type: DataTypes.INTEGER,
    },
    info: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })
  
  this.models.Patients = this.sequelize.define('patient', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    secondName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronomicName: {
      type: DataTypes.STRING
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
        
    },
    snils: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })

  this.models.Posts = this.sequelize.define('post', {
    postName: {
      type: DataTypes.STRING,
      allowNull: false
    },


  })

  this.models.MedicalOrgs = this.sequelize.define('medical_org', {
    medOrgName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inn: {
      type: DataTypes.STRING,
      allowNull: true
    },
  })

  this.models.API = this.sequelize.define('api', {
    apiName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiSecret: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiVersion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    medOrgId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  })


  this.models.Rooms = this.sequelize.define('room', {
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    token: {
      type: DataTypes.TEXT,
      
    },
    meetingStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    meetingEnd:  {
      type: DataTypes.DATE
    },
    ended: {
      type: DataTypes.BOOLEAN
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    protocol: {
      type: DataTypes.TEXT
    }
  })

  this.models.Messages = this.sequelize.define('message', {
    text: {
      type: DataTypes.STRING
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      
    }
    
    
  })

  this.models.Files = this.sequelize.define('file', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    }
  })

  this.models.Url = this.sequelize.define('url', {
    originalUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  this.models.PayTypes = this.sequelize.define('pay_types', {
    payTypeName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  this.models.Payments = this.sequelize.define('payments', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentDetails: {
      type: DataTypes.TEXT,
    }
  })

  this.models.Slots = this.sequelize.define('slot', {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slotStartDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    slotEndDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isBusy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    slotStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  })

  this.models.SlotStatus = this.sequelize.define('slot_status', {
    slotStatusName: {
      type: DataTypes.STRING,
      allowNull: false
    }

  })

  this.models.Services = this.sequelize.define('services', {
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serviceShortName: {
      type: DataTypes.STRING,
      allowNull: true

    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeDurationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    }
  }, {
    timestamps: false
  })

  this.models.Logs = this.sequelize.define('logs', {
    logTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    logMessage: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })

  this.models.LogTypes = this.sequelize.define('log_types', {
    logTypeName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  this.models.Settings = this.sequelize.define('settings', {
    settingName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    settingType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  this.models.WeekDays = this.sequelize.define('week_days', {
    id: {
      type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  })

  this.models.Schedule = this.sequelize.define('schedule', {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scheduleDayId: { //0 - вс, 1 - пн, ..., 6 - сб
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scheduleStartTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    scheduleEndTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    scheduleStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    scheduleServiceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }

  })
  

  }

  defineAssociations() {
    /* const { Users, UsersRoles, Teachers, Students, ClassLevels, Classes, StudentsMarks, ClassLesons, Lessons, Modules } = this.models; */
    /* Classes.hasOne(Students, { foreignKey: 'classId'})
    Students.belongsTo(Classes, { foreignKey: 'classId' }); */
    const { Users, UsersRoles, Doctors, Admins, Patients, Tokens, Rooms, Messages, Files, Url, Settings, LogTypes, Logs, Services, Slots, Payments, PayTypes, 
          SlotStatus, ConfirmCodes, MedicalOrgs, Posts, API, Schedule, WeekDays } = this.models;

    UsersRoles.hasMany(Users, {foreignKey: 'userRoleId'});
    Users.belongsTo(UsersRoles, {foreignKey: 'userRoleId'})

    Users.hasMany(Tokens, {foreignKey: 'userId'})
    Tokens.belongsTo(Users, {foreignKey: 'userId'})

    Doctors.hasMany(Schedule, {foreignKey: 'doctorId'})
    Schedule.belongsTo(Doctors, {foreignKey: 'doctorId'})

    WeekDays.hasMany(Schedule, {foreignKey: 'scheduleDayId'})
    Schedule.belongsTo(WeekDays, {foreignKey: 'scheduleDayId'})

    Services.hasMany(Schedule, {foreignKey: 'scheduleServiceTypeId'})
    Schedule.belongsTo(Services, {foreignKey: 'scheduleServiceTypeId'})

    Users.hasMany(ConfirmCodes, {foreignKey: 'userId'})
    ConfirmCodes.belongsTo(Users, {foreignKey: 'userId'})

    Users.hasOne(Doctors, {foreignKey: 'userId'})
    Users.hasOne(Admins, {foreignKey: 'userId'})
    Users.hasOne(Patients, {foreignKey: 'userId'})
    Doctors.belongsTo(Users, {foreignKey: 'userId'})
    Admins.belongsTo(Users, {foreignKey: 'userId'})
    Patients.belongsTo(Users, {foreignKey: 'userId'})

    MedicalOrgs.hasMany(Doctors, {foreignKey: 'medOrgId'})
    Doctors.belongsTo(MedicalOrgs, {foreignKey: 'medOrgId'})
    
    MedicalOrgs.hasMany(Admins, {foreignKey: 'medOrgId'})
    Admins.belongsTo(MedicalOrgs, {foreignKey: 'medOrgId'})

    MedicalOrgs.hasMany(API, {foreignKey: 'medOrgId'})
    API.belongsTo(MedicalOrgs, {foreignKey: 'medOrgId'})

    Posts.hasMany(Doctors, {foreignKey: 'postId'})
    Doctors.belongsTo(Posts, {foreignKey: 'postId'})

    Users.belongsToMany(Rooms, { through: 'users_rooms' });
    Rooms.belongsToMany(Users, { through: 'users_rooms' });

    
    Users.belongsToMany(Settings, { through: 'users_settings' });
    Settings.belongsToMany(Users, { through: 'users_settings' });

    Rooms.hasMany(Messages, {foreignKey: 'roomId'})
    Messages.belongsTo(Rooms, {foreignKey: 'roomId'})
    
    Slots.hasOne(Rooms, {foreignKey: 'slotId'})
    Rooms.belongsTo(Slots, {foreignKey: 'slotId'})

    Users.hasMany(Messages, {foreignKey: 'userId'})
    Messages.belongsTo(Users, {foreignKey: 'userId'})

    Messages.hasMany(Files, {foreignKey: 'messageId'})
    Files.belongsTo(Messages, {foreignKey: 'messageId'})  

    Users.hasMany(Url, {foreignKey: 'userId'})
    Url.belongsTo(Users, {foreignKey: 'userId'}) 

    LogTypes.hasMany(Logs, {foreignKey: 'logTypeId'})
    Logs.belongsTo(LogTypes, {foreignKey: 'logTypeId'})

    Users.hasMany(Logs, {foreignKey: 'userId'})
    Logs.belongsTo(Users, {foreignKey: 'userId'})

    Users.hasMany(Payments, {foreignKey: 'userId'})
    Payments.belongsTo(Users, {foreignKey: 'userId'})

    PayTypes.hasMany(Payments, {foreignKey: 'payTypeId'})
    Payments.belongsTo(PayTypes, {foreignKey: 'payTypeId'})

    Slots.hasOne(Payments, {foreignKey: 'slotId'})
    Payments.belongsTo(Slots, {foreignKey: 'slotId'})

    Doctors.hasMany(Slots, {foreignKey: 'doctorId'})
    Slots.belongsTo(Doctors, {foreignKey: 'doctorId'})

    Services.hasMany(Slots, {foreignKey: 'serviceId'})
    Slots.belongsTo(Services, {foreignKey: 'serviceId'})
    
    Patients.hasMany(Slots, {foreignKey: 'patientId'})
    Slots.belongsTo(Patients, {foreignKey: 'patientId'})
    //serviceId patientId
    Rooms.hasMany(Url, {foreignKey: 'roomId'})
    Url.belongsTo(Rooms, {foreignKey: 'roomId'})

    SlotStatus.hasMany(Slots, {foreignKey:'slotStatusId'})
    Slots.belongsTo(SlotStatus, {foreignKey:'slotStatusId'})

  }

  async sync(type = null) {
    if (!type) {
      await this.sequelize.sync();
    }
    else {
      await this.sequelize.sync(type);
      const service = await this.models.Services.create({serviceShortName: 'ТМК', serviceName: 'Телемедицинская консультация', price: 1500})
      const FreePayType = this.models.PayTypes.create({payTypeName: 'Бесплатно'})
      const SubPayType = this.models.PayTypes.create({payTypeName: 'Подписка'})
      const OneTimePayType = this.models.PayTypes.create({payTypeName: 'Единовременная'})
      const BenifitPayType = this.models.PayTypes.create({payTypeName: 'Льготная'})

      const statusFree = this.models.SlotStatus.create({slotStatusName: 'Свободно'})
      const statusNotPaid = this.models.SlotStatus.create({slotStatusName: 'Ждёт оплаты'})
      const statusPaid = this.models.SlotStatus.create({slotStatusName: 'Оплачено'})
      const statusEnded = this.models.SlotStatus.create({slotStatusName: 'Завершено'})

      const systemLogType = await this.models.LogTypes.create({logTypeName: 'Системный лог'})
      const paymentLogType = await this.models.LogTypes.create({logTypeName: 'Платёжный лог'})
      const slotsLogType = await this.models.LogTypes.create({logTypeName: 'Лог слотов'})
      const roomsLogType = await this.models.LogTypes.create({logTypeName: 'Лог комнат'})


      const superAdminRole = await this.models.UsersRoles.create({roleName: 'СуперАдминистратор', accessLevel: '4'})
      const adminRole = await this.models.UsersRoles.create({roleName: 'Администратор', accessLevel: '3'})
      const doctorRole = await this.models.UsersRoles.create({roleName: 'Врач', accessLevel: '2'})
      const patientRole = await this.models.UsersRoles.create({roleName: 'Пациент', accessLevel: '1'})

      
      const healthyChildOrg = await this.models.MedicalOrgs.create({medOrgName: 'Здоровый ребёнок'})


      const password = 'test'
      const adminPassword = 'admin'
      const pass_to_hash = password.valueOf();
      const admin_pass_to_hash = adminPassword.valueOf();
      const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
      const adminHashPassword = bcrypt.hashSync(admin_pass_to_hash, 8)



      const testUserDoctor = await this.models.Users.create({login: 'test', password: hashPassword, userRoleId: doctorRole.id, phone: '89518531984', email: 'andrey.novichihin1@gmail.com'})
      const testDoctor = await this.models.Doctors.create({userId: testUserDoctor.id, secondName: 'Тестов', firstName: 'Тест', patronomicName: 'Тестович', birthDate: new Date(), info: 'Тестовый доктор', medOrgId: healthyChildOrg.id})

      /* scheduleStartTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      scheduleEndTime */
      const monday = await this.models.WeekDays.create({name: 'Понедельник', id: 1})
      const tuesday = await this.models.WeekDays.create({name: 'Вторник', id: 2})
      const wednesday = await this.models.WeekDays.create({name: 'Среда', id: 3})
      const thursday = await this.models.WeekDays.create({name: 'Четверг', id: 4})
      const friday = await this.models.WeekDays.create({name: 'Пятница', id: 5})
      const saturday = await this.models.WeekDays.create({name: 'Суббота', id: 6})
      const sunday = await this.models.WeekDays.create({name: 'Воскресенье', id: 0})


      const testMon1Schedule = await this.models.Schedule.create({scheduleDayId: monday.id, doctorId: testDoctor.id, scheduleStartTime: '10:00', scheduleEndTime: '13:00', scheduleServiceTypeId: 1})
      const testMon2Schedule = await this.models.Schedule.create({scheduleDayId: monday.id, doctorId: testDoctor.id, scheduleStartTime: '14:00', scheduleEndTime: '16:00', scheduleServiceTypeId: 1})
      const testTue1Schedule = await this.models.Schedule.create({scheduleDayId: tuesday.id, doctorId: testDoctor.id, scheduleStartTime: '9:00', scheduleEndTime: '13:00', scheduleServiceTypeId: 1})
      const testTue2Schedule = await this.models.Schedule.create({scheduleDayId: tuesday.id, doctorId: testDoctor.id, scheduleStartTime: '14:00', scheduleEndTime: '18:00', scheduleServiceTypeId: 1})
      
      const testUserDoctor2 = await this.models.Users.create({login: '88001111112', password: hashPassword, userRoleId: doctorRole.id, phone: '88001111112', email: null})
      const testDoctor2 = await this.models.Doctors.create({userId: testUserDoctor2.id, secondName: 'Гуров', firstName: 'Александр', patronomicName: 'Анатольевич', birthDate: new Date(), 
                                                            info: 'Тестовый доктор', snils: '07680070095', medOrgId: healthyChildOrg.id})
      

      const testUserPatient = await this.models.Users.create({login: 'test1', password: hashPassword, userRoleId: patientRole.id, phone: '89507730984', email: 'andrei_novichihin@mail.ru'})
      const testPatient = await this.models.Patients.create({userId: testUserPatient.id, secondName: 'Пациентов', firstName: 'Пациент', patronomicName: 'Пациентович', birthDate: new Date(), info: 'Тестовый пациент'})
      
      const testUserPatient2 = await this.models.Users.create({login: 'test2', password: hashPassword, userRoleId: patientRole.id, phone: '88005553535'})
      const testPatient2 = await this.models.Patients.create({userId: testUserPatient2.id, secondName: 'Иванов', firstName: 'Иван', patronomicName: 'Иванович', birthDate: new Date(), info: 'Тестовый пациент 2'})

      const testUserAdmin = await this.models.Users.create({login: 'admin', password: adminHashPassword, userRoleId: adminRole.id, phone: '0'})
      const testAdmin = await this.models.Admins.create({userId: testUserAdmin.id, secondName: 'Админов', firstName: 'Админ', patronomicName: 'Админович', birthDate: new Date(), info: 'Тестовый админ', medOrgId: healthyChildOrg.id})
      
      const testSuperUserAdmin = await this.models.Users.create({login: 'superAdmin', password: adminHashPassword, userRoleId: superAdminRole.id, phone: '01'})
      const testSuperAdmin = await this.models.Admins.create({userId: testSuperUserAdmin.id, secondName: 'Админов', firstName: 'Админ', patronomicName: 'Админович', birthDate: new Date(), info: 'Тестовый админ'})
      
      
      const room = await this.models.Rooms.create({roomName: 'sometestroomname', meetingStart: new Date()})
      
      const testSlot = await this.models.Slots.create({doctorId: testDoctor.id, slotStartDateTime: moment(new Date()).add(1, 'm').toDate(), slotEndDateTime: moment(new Date()).add(31, 'm').toDate(), serviceId: service.id, isBusy: true, patientId: testPatient.id})
      const testSlot2 = await this.models.Slots.create({doctorId: testDoctor.id, slotStartDateTime: moment(new Date()).add(11, 'm').toDate(), slotEndDateTime: moment(new Date()).add(41, 'm').toDate(), serviceId: service.id, isBusy: true, patientId: testPatient2.id})
      
      const testSlot3 = await this.models.Slots.create({doctorId: testDoctor.id, slotStartDateTime: '2024-10-28T11:30:00.000Z', slotEndDateTime: '2024-10-28T12:00:00.000Z', serviceId: service.id, isBusy: true, patientId: testPatient.id})

      const roomName3 = await UserManager.translit(`${testDoctor.secondName}_${testPatient2.secondName}_${testSlot3.slotStartDateTime.getTime()}`)
      const roomForSlot3 = await this.models.Rooms.create({roomName: roomName3, meetingStart: testSlot3.slotStartDateTime, slotId: testSlot3.id})

      const roomName = await UserManager.translit(`${testDoctor.secondName}_${testPatient.secondName}_${testSlot.slotStartDateTime.getTime()}`)
      
      const roomName2 = await UserManager.translit(`${testDoctor.secondName}_${testPatient2.secondName}_${testSlot2.slotStartDateTime.getTime()}`)
      const roomForSlot = await this.models.Rooms.create({roomName: roomName, meetingStart: testSlot.slotStartDateTime, slotId: testSlot.id})
      const roomForSlot2 = await this.models.Rooms.create({roomName: roomName2, meetingStart: testSlot.slotStartDateTime, slotId: testSlot2.id})
      
      const botPassword = 'askjdbknasbdprpehurdfdf'
      const pass_to_hash_bot = botPassword.valueOf();
      const hashPasswordBot = bcrypt.hashSync(pass_to_hash_bot, 8);

      const botUser = await this.models.Users.create({login: 'telegram_bot', password: hashPasswordBot, phone: "999999999", confirmed: true, userRoleId: adminRole.id})
      const token = await this.models.Tokens.create({userId: botUser.id, refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImxvZ2luIjoidGVsZWdyYW1fYm90IiwicGFzc3dvcmQiOiIkMmEkMDgkNDNzVGZlYzhiZFgwbWtaMmhGeUhTT0w1Q3hWRkRaTS5CeWMvLkNvVi93LnBYbkpmaVdsRXEiLCJhY2Nlc3NMZXZlbCI6MywiYXZhdGFyIjpudWxsLCJlbWFpbCI6IiIsInBob25lIjoiOTk5OTk5OTk5Iiwicm9sZU5hbWUiOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCIsInNlY29uZE5hbWUiOiLQkdC-0YIiLCJmaXJzdE5hbWUiOiLQkdC-0YIiLCJwYXRyb25vbWljTmFtZSI6ItCR0L7RgiIsImluZm8iOm51bGwsImJpcnRoRGF0ZSI6bnVsbCwiaWF0IjoxNzIzMTIzMzI0LCJleHAiOjE4NTc3MTUzMjR9.FYtvlt1SqfPE53f3Kw_JHGfTUl_ug9ilRUwVHYEtDpM"})

      const payloadForUser1 = {
        aud: roomName, // аудитория (аудитория приложения, например jitsi)
        iss: JITSI_APP_ID, // издатель токена
        sub: JITSI_SERVER_URL, // цель токена (обычно URL сервера)
        room: roomName, // комната, к которой предоставляется доступ, используйте '*' для доступа ко всем комнатам
        nbf: moment(testSlot.slotStartDateTime).add(-10, 'd').unix(),
        exp: moment(testSlot.slotEndDateTime).unix(), // время истечения срока действия токена (например, через час)
        moderator: true, // установить true, если пользователь является модератором
        context: {
          user: {
            id: testUserDoctor.id,
            name: `${testDoctor.secondName} ${testDoctor.firstName}`, // имя пользователя
            email: testUserDoctor.email, // email пользователя
            avatar: testUserDoctor.avatar, // URL аватара пользователя (необязательно)
            
          }
        }
      };

      const payloadForPatient1 = {
        aud: roomName, // аудитория (аудитория приложения, например jitsi)
        iss: JITSI_APP_ID, // издатель токена
        sub: JITSI_SERVER_URL, // цель токена (обычно URL сервера)
        room: roomName, // комната, к которой предоставляется доступ, используйте '*' для доступа ко всем комнатам
        nbf: moment(testSlot.slotStartDateTime).add(-1, 'm').unix(),
        exp: moment(testSlot.slotEndDateTime).unix(), // время истечения срока действия токена (например, через час)
        moderator: false, // установить true, если пользователь является модератором
        context: {
          user: {
            id: testUserPatient.id,
            name: `${testPatient.secondName} ${testPatient.firstName}`, // имя пользователя
            email: testUserPatient.email, // email пользователя
            avatar: testUserPatient.avatar, // URL аватара пользователя (необязательно)
            
          }
        }
      };

      const tokenUser1 = jwt.sign(payloadForUser1, JITSI_SECRET);
      const tokenPatient1 = jwt.sign(payloadForPatient1, JITSI_SECRET);


      const { customAlphabet } = await import('nanoid');
      const nanoid = customAlphabet(ALPHABET, 10);
      const shortUrl1 = nanoid();
      const newUrlEntity1 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot.roomName}?token=${tokenUser1}`, shortUrl: shortUrl1, roomId: roomForSlot.id, userId: testUserDoctor.id })
      const shortUrl2 = nanoid();
      const newUrlEntity2 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot2.roomName}`, shortUrl: shortUrl2, roomId: roomForSlot2.id, userId: testUserDoctor.id})
      const shortUrl3 = nanoid();
      const newUrlEntity3 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot.roomName}?token=${tokenPatient1}`, shortUrl: shortUrl3, roomId: roomForSlot.id, userId: testUserPatient.id })
      const shortUrl4 = nanoid();
      const newUrlEntity4 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot2.roomName}`, shortUrl: shortUrl4, roomId: roomForSlot2.id, userId: testUserPatient2.id})
      
      const shortUrl5 = nanoid();
      const newUrlEntity5 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot3.roomName}?token=${tokenPatient1}`, shortUrl: shortUrl5, roomId: roomForSlot3.id, userId: testUserPatient.id })
      const shortUrl6 = nanoid();
      const newUrlEntity6 = await this.models.Url.create({originalUrl: `${process.env.CLIENT_URL}/room/${roomForSlot3.roomName}`, shortUrl: shortUrl6, roomId: roomForSlot3.id, userId: testUserDoctor.id})
    }
    
    console.log('All models were synchronized successfully.');
  }
}

/* module.exports = new Database(); */
