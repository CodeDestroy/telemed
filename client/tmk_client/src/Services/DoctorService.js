import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class DoctorService {

    static async getConsultations (userId) {
        return $api.get('/api/doctor/consultations/active', {params: {userId}});
    }

    static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    }

    static async createScheduler (doctorId, scheduleDay, scheduleStartTime, scheduleEndTime) {
        return $api.post('/api/doctor/scheduler', {doctorId, scheduleDay, scheduleStartTime, scheduleEndTime})
    }

    static async getSchedule (doctorId) {
        return $api.get('/api/doctor/scheduler', {params: {doctorId}})
    }

    static async deleteSchedule (id) {
        return $api.post('/api/doctor/scheduler/delete', {id})
    }

    
}
