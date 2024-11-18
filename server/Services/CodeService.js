const moment = require('moment-timezone');
const database = require('../models/index');
const nodemailer = require('nodemailer');
const UserDto = require('../Dtos/UserDto')
const tokenService = require('../Services/token-service')
class CodeService {
    async createNewCode(userId, activeMinutes) {
        try {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const expireDate = moment(new Date()).add(activeMinutes, 'm').toDate()
            const newCode = await database["ConfirmCodes"].create({
                code, userId: userId, expireDate
            })
            return newCode
        }
        catch (e) {
            console.log(e.message)
        }
        
    }

    async sendCode (code, email, phone) {
        try {

        }
        catch (e) {
            console.log(e)
        }
    }

    async checkCode(userId, code) {
        try {
            const confirmCode =  await database["ConfirmCodes"].findOne({
                where: {
                    userId: userId,
                    code: code
                },
                order: [
                    ['id', 'DESC'],
                ]
            })
            if (confirmCode) return confirmCode
            else return null
        }
        catch (e) {
            console.log(e)
        }
    }

    async loginByPhone(phone) {
        try {
            //find user
            const user = await database["Users"].findOne({
                where: {
                    phone: phone
                },
                include: [{
                    model: database["UsersRoles"],
                    required: true
                }]
            })
            /* console.log(user) */

            if (!user) {
                return ApiError.AuthError(`Пользователь ${login} не найден`)
            }
            console.log(user)
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
                case 2:
                    let doctor = await database["Doctors"].findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDto = await UserDto.deserialize(user, user.UsersRole, doctor)
                    /* console.log({...userDto}) */
                    const tokens = await tokenService.generateTokens({...userDto});
                    await tokenService.saveToken(user.id, tokens.refreshToken);
                    //send answer (user and tokens)
                    return { ...tokens, user: userDto } 
                case 3:
                    let admin = await database["Admins"].findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    
                    const userDtoAdmin = await UserDto.deserialize(user, user.UsersRole, admin)
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
        }
    }
    
}

module.exports = new  CodeService();