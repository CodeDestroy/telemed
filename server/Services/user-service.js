const tokenService = require('./token-service')

//const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcryptjs')
/* const ApiError = require('../Errors/api-error'); */

/* const UserDto = require('../dtos/user-dto'); */
const database = require('../Database/setDatabase');
const ApiError = require('../Errors/api-error');
const UserDto = require('../Dtos/UserDto');
const {Op} = require('sequelize')

class UserService {
    
   /*  async registrationPatient (login, password, patient_id) {
        try {
            //find candidate            
            const candidate = await prisma.uirs_users_db.findMany({
                where: {
                    login: login,
                },
              })
              
            //if user already exists
            if (candidate.length > 0) {
                //send error
                throw ApiError.BadRequest(`Пользователь ${login} уже существует`)
            }

            //hash password
            const pass_to_hash = password.valueOf();
            const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
            
            const uirs_users_db =  await prisma.uirs_users_db.create({
                data: {
                    login: login,
                    password: hashPassword
                },
            })
            const uirs_users = await prisma.uirs_users.create({
                data: {
                    role_id: 2,
                    uirs_users_db_id: uirs_users_db.id
                }
            })
            await prisma.uirs_users_db.update({
                where: {
                    id: uirs_users_db.id,
                },
                data: {
                    uirs_users_id: uirs_users.id,
                },
              })

            const uirs_users_patients_doctors = await prisma.uirs_users_patients_doctors.create({
                data: {
                    patient_id: patient_id,
                    uirs_users_id: uirs_users.id,
                }
            });
            await prisma.uirs_users.update({
                where: {
                    id: uirs_users.id,
                },
                data: {
                    uirs_users_patients_doctors_id: uirs_users_patients_doctors.id,
                },
              })

            //return userDto and tokens
            return { user: uirs_users_db }
        }
        catch (e) {
            console.log(e)
        }
    }
    //registration method
    async registration (Doctor_id, login, password, role_id) {
        try {
            //find candidate            
            const candidate = await prisma.uirs_users_db.findMany({
                where: {
                    login: login,
                },
              })
              
            //if user already exists
            if (candidate.length > 0) {
                //send error
                throw ApiError.BadRequest(`Пользователь ${login} уже существует`)
            }

            //hash password
            const pass_to_hash = password.valueOf();
            const hashPassword = bcrypt.hashSync(pass_to_hash, 8);
            
            const uirs_users_db =  await prisma.uirs_users_db.create({
                data: {
                    login: login,
                    password: hashPassword
                },
            })
            const uirs_users = await prisma.uirs_users.create({
                data: {
                    role_id: parseInt(role_id),
                    uirs_users_db_id: uirs_users_db.id
                }
            })
            await prisma.uirs_users_db.update({
                where: {
                    id: uirs_users_db.id,
                },
                data: {
                    uirs_users_id: uirs_users.id,
                },
              })
            let doctor;
            let uirs_users_patients_doctors;
            if (Doctor_id ) {
                doctor = await prisma.doctor.findUnique({
                    where: {
                        id: parseInt(Doctor_id)
                    }
                })
                uirs_users_patients_doctors = await prisma.uirs_users_patients_doctors.create({
                    data: {
                        uirs_users_id: uirs_users.id,
                        doctor_id: doctor.id
                    }
                })
            }
            else {
                uirs_users_patients_doctors = await prisma.uirs_users_patients_doctors.create({
                    data: {
                        uirs_users_id: uirs_users.id,
                    }
                })
            }
            await prisma.uirs_users.update({
                where: {
                    id: uirs_users.id,
                },
                data: {
                    uirs_users_patients_doctors_id: uirs_users_patients_doctors.id,
                },
              })
            const userDto = await UserDto.deserialize(uirs_users_db, uirs_users, uirs_users_patients_doctors, doctor)
            const tokens = tokenService.generateTokens({...userDto});
            //save token to DB
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            
            //return userDto and tokens
            return { ...tokens, user: userDto }
        }
        catch (e) {
            console.log(e)
        }
    } */


    async createUser (roleId, login, password, avatar, email, phone  ) {
        try {
            
            const candidate = await database.models.Users.findOne({
                where: {
                    [Op.or]: [
                        {
                            login: login,
                        },
                        {
                            phone: phone,
                        }
                    ]
                    
                },
            })
            
            if (candidate) {
                throw ApiError.BadRequest(`Пользователь ${login} уже существует`)
            }

            const pass_to_hash = password.valueOf();
            const hashPassword = await bcrypt.hash(pass_to_hash, 8);
            let newUser = null
            if (avatar)
                newUser = await database.models.Users.create({
                    login: phone, password: hashPassword, userRoleId: roleId, phone: phone, email, avatar
                })
            else 
                newUser = await database.models.Users.create({
                    login: phone, password: hashPassword, userRoleId: roleId, phone: phone, email
                })
            return newUser
        }
        catch (e) {
            console.log(e)
            throw e
        }
            

    }

    //login
    async login(login, password) {
        try {
            //find user
            const user = await database.models.Users.findOne({
                where: {
                    login: login
                },
                include: [{
                    model: database.models.UsersRoles,
                    required: true
                }]
            })
            /* console.log(user) */

            if (!user) {
                return ApiError.AuthError(`Пользователь ${login} не найден`)
            }
            if (!user.confirmed) {
                return ApiError.AuthError(`Подтвердите регистрацию`)
            }
            const isPassEquals = await bcrypt.compare(password, user.password);
            //if not
            if (!isPassEquals) {
                return ApiError.AuthError(`Неверный пароль`)
            }
            switch (user.users_role.accessLevel) {
                case 1: 
                    let patient = await database.models.Patients.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDtoPatient = await UserDto.deserialize(user, user.users_role, patient)
                    const tokensPatient = await tokenService.generateTokens({...userDtoPatient});
                    /* console.log(tokensPatient) */
                    await tokenService.saveToken(user.id, tokensPatient.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensPatient, user: userDtoPatient } 
                    break;
                case 2:
                    let doctor = await database.models.Doctors.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDto = await UserDto.deserialize(user, user.users_role, doctor)
                    /* console.log({...userDto}) */
                    const tokens = await tokenService.generateTokens({...userDto});
                    await tokenService.saveToken(user.id, tokens.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokens, user: userDto } 
                case 3:
                    let admin = await database.models.Admins.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDtoAdmin = await UserDto.deserialize(user, user.users_role, admin)
                    /* console.log({...userDtoAdmin}) */
                    const tokensAdmin = await tokenService.generateTokens({...userDtoAdmin});
                    await tokenService.saveToken(user.id, tokensAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensAdmin, user: userDtoAdmin } 
                default: 
                    return ApiError.AuthError(`Ошибка авторизации`)
            }

        }
        catch (e) {
            
            console.log(e)
            throw e
        }
    }
    
    //logout
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    //refresh auth
    async refresh(refreshToken) {
        try{
            if (!refreshToken){
                throw ApiError.UnauthorizedError();
            }
            const userData = await tokenService.validateRefreshToken(refreshToken);
            
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                console.log('не валидный токен или нет в БД')
                throw ApiError.UnauthorizedError();
            }
            const user = await database.models.Users.findOne({
                where: {
                    id: userData.id,
                },
                include: [{
                    model: database.models.UsersRoles,
                    required: true
                }]
            })
            switch (user.users_role.accessLevel) {
                case 1: 
                    let patient = await database.models.Patients.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    const userDtoPatient = await UserDto.deserialize(user, user.users_role, patient)
                    const tokensPatient = await tokenService.generateTokens({...userDtoPatient});
                    await tokenService.saveToken(userDtoPatient.id, tokensPatient.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensPatient, user: userDtoPatient } 
                case 2:
                    let doctor = await database.models.Doctors.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDto = await UserDto.deserialize(user, user.users_role, doctor)
                    const tokens = await tokenService.generateTokens({...userDto});
                    await tokenService.saveToken(user.id, tokens.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokens, user: userDto } 
                case 3:
                    let admin = await database.models.Admins.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    const userDtoAdmin = await UserDto.deserialize(user, user.users_role, admin)
                    const tokensAdmin = await tokenService.generateTokens({...userDtoAdmin});
                    await tokenService.saveToken(userDtoAdmin.id, tokensAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensAdmin, user: userDtoAdmin } 
                default: 
                
                    return [] 
            }         
        }
        catch (e) {
            console.log(e)
        }
    }

    async checkPhone (phone) {
        try {
            const user = await database.models.Users.findOne({
                where: {
                    login: phone,
                    phone: phone
                },
                include: [
                    {
                        model: database.models.Doctors,
                        required: false
                    },{
                        model: database.models.Admins,
                        required: false
                    },{
                        model: database.models.Patients,
                        required: false
                    },

                ]
            })
            if (user) 
                return user
            else return null
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

}


module.exports = new UserService();