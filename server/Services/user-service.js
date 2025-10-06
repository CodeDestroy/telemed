const tokenService = require('./token-service')

//const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcryptjs')
/* const ApiError = require('../Errors/api-error'); */

/* const UserDto = require('../dtos/user-dto'); */
/* const database = require('../Database/setDatabase'); */
const ApiError = require('../Errors/api-error');
const UserDto = require('../Dtos/UserDto');
const {Op} = require('sequelize')
const database = require('../models/index')

class UserService {

    async createUser (roleId, login, password, avatar, email, phone  ) {
        try {
            
            const candidate = await database["Users"].findOne({
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
                newUser = await database["Users"].create({
                    login: phone.trim(), password: hashPassword, userRoleId: roleId, phone: phone.trim(), email: email.trim(), avatar
                })
            else 
                newUser = await database["Users"].create({
                    login: phone.trim(), password: hashPassword, userRoleId: roleId, phone: phone.trim(), email: email.trim()
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
            const user = await database["Users"].findOne({
                where: {
                    login: login
                },
                include: [
                    {
                        model: database["UsersRoles"],
                        required: true
                    }
                ],
            })

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
            switch (user.UsersRole.accessLevel) {
                case 1: 
                    let patient = await database["Patients"].findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDtoPatient = await UserDto.deserialize(user, user.UsersRole, patient)
                    const tokensPatient = await tokenService.generateTokens({...userDtoPatient});
                    /* console.log(tokensPatient) */
                    await tokenService.saveToken(user.id, tokensPatient.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensPatient, user: userDtoPatient } 
                    break;
                case 2:
                    /* let doctor = await database["Doctors"].findOne({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    }) */
                    let doctors = await database["Doctors"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            },
                            {
                                model: database["Posts"],
                                required: false,
                                through: { attributes: [] }
                            }
                        ]
                    })

                    //const userDto = await UserDto.deserialize(user, user.UsersRole, doctor)
                    const newUserDto = await UserDto.serializeWorker(user, user.UsersRole, doctors)
                    /* console.log({...userDto}) */
                    const tokens = await tokenService.generateTokens({...newUserDto});
                    await tokenService.saveToken(user.id, tokens.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokens, user: newUserDto } 
                case 3:
                    let admins = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    
                    const userDtoAdmin = await UserDto.serializeWorker(user, user.UsersRole, admins)
                    /* console.log({...userDtoAdmin}) */
                    const tokensAdmin = await tokenService.generateTokens({...userDtoAdmin});
                    await tokenService.saveToken(user.id, tokensAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensAdmin, user: userDtoAdmin } 
                case 4:
                    let superAdmins = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    const userDtoSuperAdmin = await UserDto.serializeWorker(user, user.UsersRole, superAdmins)
                    /* console.log({...userDtoAdmin}) */
                    const tokensSuperAdmin = await tokenService.generateTokens({...userDtoSuperAdmin});
                    await tokenService.saveToken(user.id, tokensSuperAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensSuperAdmin, user: userDtoSuperAdmin }
                case 5:
                    let operators = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    const userDtoOperator = await UserDto.serializeWorker(user, user.UsersRole, operators)
                    /* console.log({...userDtoAdmin}) */
                    const tokensOperator = await tokenService.generateTokens({...userDtoOperator});
                    await tokenService.saveToken(user.id, tokensOperator.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensOperator, user: userDtoOperator }  
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
            const user = await database["Users"].findOne({
                where: {
                    id: userData.id,
                },
                include: [{
                    model: database["UsersRoles"],
                    required: true
                }]
            })
            switch (user.UsersRole.accessLevel) {
                case 1: 
                    let patient = await database["Patients"].findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    const userDtoPatient = await UserDto.deserialize(user, user.UsersRole, patient)
                    const tokensPatient = await tokenService.generateTokens({...userDtoPatient});
                    await tokenService.saveToken(userDtoPatient.id, tokensPatient.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensPatient, user: userDtoPatient } 
                case 2:

                    let doctors = await database["Doctors"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            },
                            {
                                model: database["Posts"],
                                required: false,
                                through: { attributes: [] }
                            }
                        ]
                    })
                    const newUserDto = await UserDto.serializeWorker(user, user.UsersRole, doctors)
                    /* console.log({...userDto}) */
                    const tokens = await tokenService.generateTokens({...newUserDto});
                    await tokenService.saveToken(user.id, tokens.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokens, user: newUserDto } 
                case 3:
                    let admins = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    const userDtoAdmin = await UserDto.serializeWorker(user, user.UsersRole, admins)
                    const tokensAdmin = await tokenService.generateTokens({...userDtoAdmin});
                    await tokenService.saveToken(userDtoAdmin.id, tokensAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensAdmin, user: userDtoAdmin }
                case 4:
                    let superAdmins = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    
                    const userDtoSuperAdmin = await UserDto.serializeWorker(user, user.UsersRole, superAdmins)
                    /* console.log({...userDtoAdmin}) */
                    const tokensSuperAdmin = await tokenService.generateTokens({...userDtoSuperAdmin});
                    await tokenService.saveToken(user.id, tokensSuperAdmin.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensSuperAdmin, user: userDtoSuperAdmin }  
                case 5:
                    let operators = await database["Admins"].findAll({
                        where: {
                            userId: user.id
                        },
                        include: [
                            {
                                model: database["MedicalOrgs"],
                                required: true
                            }
                        ]
                    })
                    
                    const userDtoOperator = await UserDto.serializeWorker(user, user.UsersRole, operators)
                    /* console.log({...userDtoAdmin}) */
                    const tokensOperator = await tokenService.generateTokens({...userDtoOperator});
                    await tokenService.saveToken(user.id, tokensOperator.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokensOperator, user: userDtoOperator }  
                default: 
                
                    return [] 
            }         
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async checkPhone (phone) {
        try {
            const user = await database["Users"].findOne({
                where: {
                    login: phone,
                    phone: phone
                },
                include: [
                    {
                        model: database["Doctors"],
                        required: false
                    },{
                        model: database["Admins"],
                        required: false
                    },{
                        model: database["Patients"],
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

    async setPassword (userId, password) {
        try {
            const pass_to_hash = password.valueOf();
            const hashPassword = await bcrypt.hash(pass_to_hash, 8);
            await database["Users"].update({
                password: hashPassword,
            },
            {
                where: {
                    id: userId
                }
            })
            return true
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getUser(id) {
        try {
            const user = await database["Users"].findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: database["UsersRoles"],
                        required: true
                    }
                ],
            })
            return user
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }

    async getUserByPhone(phone) {
        try {
            const user = await database["Users"].findOne({
                where: {
                    phone: phone,
                    login: phone
                },
                include: [
                    {
                        model: database["UsersRoles"],
                        required: true
                    }
                ],
            })
            return user
        }
        catch (e) {
            console.log(e)
            throw e
        }
    }
}


module.exports = new UserService();