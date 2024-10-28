import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class SchedulerService {

    static async getDcotorSchedule (doctorId) {
        return $api.get(`/api/doctor/scheduler/${doctorId}`);
    }

    /* static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    } */
    
}
