const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs')

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
      defaultValue: 'http://localhost/images/defaultAvatar.png'
    },
    email: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false
  });

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
    medOrgId: {
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
    info: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
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
    }
  })

  }

  defineAssociations() {
    /* const { Users, UsersRoles, Teachers, Students, ClassLevels, Classes, StudentsMarks, ClassLesons, Lessons, Modules } = this.models; */
    /* Classes.hasOne(Students, { foreignKey: 'classId'})
    Students.belongsTo(Classes, { foreignKey: 'classId' }); */
    const { Users, UsersRoles, Doctors, Admins, Patients, Tokens, Rooms, Messages, Files, Url } = this.models;

    UsersRoles.hasMany(Users, {foreignKey: 'userRoleId'});
    Users.belongsTo(UsersRoles, {foreignKey: 'userRoleId'})

    Users.hasMany(Tokens, {foreignKey: 'userId'})
    Tokens.belongsTo(Users, {foreignKey: 'userId'})

    Users.hasOne(Doctors, {foreignKey: 'userId'})
    Users.hasOne(Admins, {foreignKey: 'userId'})
    Users.hasOne(Patients, {foreignKey: 'userId'})
    Doctors.belongsTo(Users, {foreignKey: 'userId'})
    Admins.belongsTo(Users, {foreignKey: 'userId'})
    Patients.belongsTo(Users, {foreignKey: 'userId'})

    Users.belongsToMany(Rooms, { through: 'Users_Rooms' });
    Rooms.belongsToMany(Users, { through: 'Users_Rooms' });

    Rooms.hasMany(Messages, {foreignKey: 'roomId'})
    Messages.belongsTo(Rooms, {foreignKey: 'roomId'})

    Users.hasMany(Messages, {foreignKey: 'userId'})
    Messages.belongsTo(Users, {foreignKey: 'userId'})

    Messages.hasMany(Files, {foreignKey: 'messageId'})
    Files.belongsTo(Messages, {foreignKey: 'messageId'})
  }

  async sync(type = null) {
    if (!type) {
      await this.sequelize.sync();
    }
    else {
      await this.sequelize.sync(type);

      const adminRole = await this.models.UsersRoles.create({roleName: 'Администратор', accessLevel: '3'})
      const doctorRole = await this.models.UsersRoles.create({roleName: 'Врач', accessLevel: '2'})
      const patientRole = await this.models.UsersRoles.create({roleName: 'Пациент', accessLevel: '1'})

      const password = 'test'
      const pass_to_hash = password.valueOf();
      const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
      const testUserDoctor = await this.models.Users.create({login: 'test', password: hashPassword, userRoleId: doctorRole.id})
      const testDoctor = await this.models.Doctors.create({userId: testUserDoctor.id, secondName: 'Тестов', firstName: 'Тест', patronomicName: 'Тестович', birthDate: new Date(), info: 'Тестовый доктор'})
      
      const testUserPatient = await this.models.Users.create({login: 'test1', password: hashPassword, userRoleId: doctorRole.id})
      const testPatient = await this.models.Doctors.create({userId: testUserPatient.id, secondName: 'Пациентов', firstName: 'Пациент', patronomicName: 'Пациентович', birthDate: new Date(), info: 'Тестовый пациент'})
      
      
      const room = await this.models.Rooms.create({roomName: 'sometestroomname', meetingStart: new Date()})
    }
    
    console.log('All models were synchronized successfully.');
  }
}

/* module.exports = new Database(); */
