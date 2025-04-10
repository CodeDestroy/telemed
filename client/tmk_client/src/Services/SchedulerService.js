import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class SchedulerService {

    static async getDcotorSchedule (doctorId, dayid) {
        return $api.get(`/api/doctor/scheduler/${doctorId}`, {params: {dayid}});
    }

    static async getDcotorScheduleDates (doctorId, date) {
        return $api.get(`/api/doctor/scheduler/date/${doctorId}`, {params: {date}});
    }
    

    /* static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    } */
    
}
