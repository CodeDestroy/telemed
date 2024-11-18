const CodeService = require("../Services/CodeService");
const DoctorService = require("../Services/DoctorService");
const userService = require("../Services/user-service");
const DateTimeManager = require("../Utils/DateTimeManager");
const ApiError = require('../Errors/api-error');
const MailManager = require("../Utils/MailManager");
const nodemailer = require('nodemailer');
const CLIENT_URL =  process.env.CLIENT_URL;
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
            /* console.log(refreshToken) */
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
                    /* throw new Error(error) */
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
}

module.exports = new AuthController()

