const CodeService = require("../Services/CodeService");
const DoctorService = require("../Services/DoctorService");
const userService = require("../Services/user-service");
const DateTimeManager = require("../Utils/DateTimeManager");
const ApiError = require('../Errors/api-error');
const MailManager = require("../Utils/MailManager");
const nodemailer = require('nodemailer');

const UserDto = require('../Dtos/UserDto');
const database = require('../models/index');
const PatientService = require("../Services/PatientService");
const CLIENT_URL =  process.env.CLIENT_URL;
const PATIENT_CLIENT_URL =  process.env.PATIENT_CLIENT_URL;

class AuthController {

    async login(req, res) {
        try {
            const login = req.body.login;
            const password = req.body.password
            
            const userData = await userService.login(login, password);

            if (userData.message != undefined)
                throw ApiError.BadRequest(userData.message)
            else {
                await res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: true})
                res.status(200).json(userData);
            }
        }
        catch (e) {
            /* res.status(401).send(e.message) */
            return res.status(401).json(e.message)
        }
    }

    async refresh (req, res) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);

            await res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: true})
            res.status(200).json(userData);
        }
        catch (e) {
            console.log(e);
            return res.status(401).json(e.message)
            
        }
    }

    async logout (req, res) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.status(200).json(token);
        }
        catch (e) {
            console.log(e);
            return res.status(401).json(e.message)
        }
    }

    async checkPhone (req, res) {
        try {
            const phone = req.query.phone;
            const userData = await userService.checkPhone(phone);
            if (userData)
                throw ApiError.BadRequest('Пользователь с данным номером телефона уже зарегистрирован')
            res.status(200).json(userData);
        }
        catch (e) {
            console.log(e)
            return res.status(500).json(e.message)
        }
        
    }

    async confirmRegistration (req, res) {
        try {
            const {secondName, name, patronomicName, birthDate, email, phone, password, snils} = req.body
            const candidate = await database['Users'].findOne({where: {email: email}})
            if (candidate) {
                throw ApiError.BadRequest('Пользователь с данным email уже зарегистрирован')
            }
            const parsedDate = await DateTimeManager.parseDateFromRussian(birthDate)
            const newUser = await userService.createUser(2, phone, password, null ,email, phone)
            newUser.confirmed = false;
            newUser.save()
            const newCode = await CodeService.createNewCode(newUser.id, 180)
            
            const link = CLIENT_URL + '/doctor/registration-step3?phone=' + phone+'&code='+newCode.code
            const transporter = await MailManager.getTransporter()
            const mailOptions = await MailManager.getMailOptionsCode(email, newCode.code, link)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Сообщение отправленно: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            const newDoctor = await DoctorService.createDoctor(newUser.id, secondName, name, patronomicName, parsedDate, null, snils, 1)
            
            res.status(200).send([newUser, newDoctor])
        }
        catch (e) {
            console.log(e)
            return res.status(500).json(e.message)
        }
    }

    async confirmRegistrationPatient (req, res) {
        try {
            const {secondName, name, patronomicName, birthDate, email, phone, password, snils} = req.body
            const candidate = await database['Users'].findOne({where: {email: email}})
            if (candidate) {
                throw ApiError.BadRequest('Пользователь с данным email уже зарегистрирован')
            }
            //const parsedDate = await DateTimeManager.parseDateFromRussian(birthDate)
            const newUser = await userService.createUser(1, phone, password, null, email, phone)
            newUser.confirmed = false;
            newUser.save()
            const newCode = await CodeService.createNewCode(newUser.id, 180)
            
            const link = PATIENT_CLIENT_URL + '/registration/registration-step3?phone=' + phone+'&code='+newCode.code
            const transporter = await MailManager.getTransporter()
            const mailOptions = await MailManager.getMailOptionsCode(email, newCode.code, link)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Сообщение отправленно: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            const newDoctor = await PatientService.createPatient(newUser.id, secondName, name, patronomicName, birthDate, null, snils)

            res.status(200).send([newUser, newDoctor])
        }
        catch (e) {
            console.log(e)
            return res.status(500).json(e.message)
        }
    }

    async confirmEmail (req, res) {
        try {
            const { phone, code } = req.body
            const user = await userService.checkPhone(phone)
            const confirmedCode = await CodeService.checkCode(user.id, code)
            if (confirmedCode !== null) {
                user.confirmed = true
                user.save()
            }
            const userData = await CodeService.loginByPhone(phone);

            if (userData.message != undefined)
                throw ApiError.BadRequest(userData.message)
            else {
                await res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: true})
                res.status(200).json(userData);
            }
        }
        catch (e) {
            console.log(e)
            return res.status(500).json(e.message)
        }
    }

    async setPassword(req, res) {
        try {
            const userId = req.params.userId
            const {password} = req.body
            const newUser = await userService.setPassword(userId, password)
            res.status(200).json(newUser)
            
        }
        catch (e) {
            res.status(500).json({error: e.message})
        }
        
    }

    async changeUser (req, res) {
        try {
            const userDto = req.body.user
            const user = await userService.getUser(userDto.id)
            const patient = await PatientService.getPatientByUserId(user.id)
            user.phone = userDto.phone
            userDto.login = userDto.phone
            user.email = userDto.email
            patient.secondName = userDto.secondName
            patient.firstName = userDto.firstName
            patient.patronomicName = userDto.patronomicName
            patient.birthDate = userDto.birthDate
            patient.snils = userDto.snils
            patient.info = userDto.info
            user.save()
            patient.save()
            const userDtoPatient = await UserDto.deserialize(user, user.UsersRole, patient)
            res.status(200).json({userDtoPatient})
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    }

    async sendRecoveryCode (req, res) {
        try {
            const {phone} = req.body
            const user = await userService.checkPhone(phone)
            if (!user) throw ApiError.BadRequest('Пользователь с таким номером телефона не зарегистрирован')
            const newCode = await CodeService.createNewCode(user.id, 180)
           
            const transporter = await MailManager.getTransporter()
            const mailOptions = await MailManager.getMailOptionsRestorePasswordCode(user.email, newCode.code)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(200).send(false)
                    return console.log(error);
                }
                console.log('Сообщение отправленно: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            res.status(200).send(true)
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    }

    async resetPassword (req, res) {
        try {
            const {phone, code, password} = req.body
            const user = await userService.checkPhone(phone)
            if (!user) throw ApiError.BadRequest('Пользователь с таким номером телефона не зарегистрирован')
            const confirmedCode = await CodeService.checkCode(user.id, code)
            if (confirmedCode !== null) {
                await userService.setPassword(user.id, password)
                user.save()
            }
            res.status(200).send(true)
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    }
}

module.exports = new AuthController()

