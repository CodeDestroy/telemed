const DoctorService = require('../Services/DoctorService')
const UserManager = require('../Utils/UserManager')
const ConsultationService = require('../Services/ConsultationService')
const smsProstoAPI = require('../Api/smsProstoApi')
const UserService = require('../Services/user-service')
const moment = require('moment-timezone')
const JITSI_SECRET = process.env.JITSI_SECRET;
const jwt = require('jsonwebtoken');
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const PatientService = require('../Services/PatientService')
const UrlManager = require('../Utils/UrlManager')
const healthyChildApi = require('../Api/healthyChildApi')
class HealthyChildController {
    async createConsultation(req, res) {
        try {
            const slot = req.body
            const {empfio, сlname, date, stime, etime, clid, empid} = req.body
            const [year, month, day] = date.split('.'); 
            
            // Конвертируем в дату
            const startDateTime = new Date(`${year}-${month}-${day}T${stime}`)
            const slotEndDateTime = new Date(`${year}-${month}-${day}T${etime}`)

            //Вычисляем длительность
            const durationMs = slotEndDateTime - startDateTime;
            const duration = durationMs / (1000 * 60);


            const employee = await healthyChildApi.getOnlineEmployeeInfo(empid)
            const employeeSnils = employee.snils.replaceAll('-', '')
            /* console.log(employee) */
            
            //Получаем ФИО Врача
            /* const doctorFIOObj = await UserManager.parseFullName(empfio) */
            //const message = await smsProstoAPI.sendMessage('89518531985', 'Привет')
            /* console.log(slot) */
            /* console.log(doctorFIOObj) */
            const doctor = await DoctorService.getDoctorBySnils(employeeSnils)
            /* const doctor = doctors[0] */
            if (!doctor) {
                console.log('Доктор не найден в системе. Обратитесь в поддержку.')
                throw new Error('Доктор не найден в системе. Обратитесь в поддержку.')
            }
            const clientHealthyChild = await healthyChildApi.getOnlineClientInfo(clid)
           /*  console.log(clientHealthyChild) */
            /* const clientHealthyChild = {
                lname: "Новичихин",
                fname: "Андрей",
                sname: "Евгеньевич",
                tel: "89518531985",
                dob: "24.12.2001",
                sex: "муж",
                "lrid": ID законного представителя клиента (если есть)
                "lrfio": ФИО законного представителя (если есть)
                "lrtel": номер телефона законного представителя (если есть)

            } */

            let patientPhone = /* clientHealthyChild?.lrtel.lenght > 0 ? clientHealthyChild?.lrtel : clientHealthyChild?.tel */ '89518531985'

            let candidate = await UserService.checkPhone(patientPhone)
            if (!candidate) {
                /* const {secondName, firstName, patronomicName} = await UserManager.parseFullName(fullname) */
                
                const formattedDate = moment(clientHealthyChild.dob, "DD.MM.YYYY").format('YYYY-MM-DD');

                const password = Math.random().toString(36).slice(-8)
                
                /* const avatar = req.file; */
                /* return res.json(avatar) */
                const info = `Законный представитель ${clientHealthyChild?.lrfio}`
                const newUser = await UserService.createUser(3, patientPhone, password, null , null , patientPhone)
                /* console.log(`newUser: \n  ${patientPhone}\n${password}`) */
                const newPatient = await PatientService.createPatient(newUser.id, clientHealthyChild.lname, clientHealthyChild.fname, clientHealthyChild.sname, formattedDate, info, null)
                candidate = await UserService.checkPhone(patientPhone)
            }
            const newSlot = await ConsultationService.createSlot(doctor.id, candidate.patient.id, startDateTime, duration)    
            const roomName = await UserManager.translit(`${doctor.secondName}_${candidate.patient.secondName}_${newSlot.slotStartDateTime.getTime()}`)
            const newRoom = await ConsultationService.createRoom(newSlot.id, roomName)
            const doctorPayload = await ConsultationService.createPayloadDoctor(doctor.id, newRoom.id)
            const patientPayload = await ConsultationService.createPayloadPatient(candidate.patient.id, newRoom.id)
            const tokenDoctor = jwt.sign(doctorPayload, JITSI_SECRET);
            const tokenPatient = jwt.sign(patientPayload, JITSI_SECRET);
            const doctorUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenDoctor}`
            const patientUrl = `${CLIENT_URL}/room/${roomName}?token=${tokenPatient}`
            const doctorShortUrl = await UrlManager.createShort(doctorUrl, doctor.user.id, newRoom.id)
            const patientShortUrl = await UrlManager.createShort(patientUrl, candidate.id, newRoom.id)
            const patientLink =  'https://mczr-tmk.ru/short/' + patientShortUrl;
            const doctorLink =  SERVER_DOMAIN + 'short/' + doctorShortUrl;

            const patinetSmsText = `Ваша ссылка на телемедицинскую консультацию: ${patientLink}`

            //const patientSMS = await smsProstoAPI.sendMessage(patientPhone, patinetSmsText)

            res.status(200).json({success: true})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({error: e.message, success: false})
        }
        
    }

}

module.exports = new HealthyChildController();