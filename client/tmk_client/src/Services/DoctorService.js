import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class DoctorService {

    static async getConsultations (userId, date) {
        return $api.get('/api/doctor/consultations/active', {params: {userId, date}});
    }

    static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    }

    static async createScheduler (doctorId, scheduleDay, scheduleStartTime, scheduleEndTime) {
        return $api.post('/api/doctor/scheduler', {doctorId, scheduleDay, scheduleStartTime, scheduleEndTime})
    }

    static async getSchedule (doctorId) {
        return $api.get(`/api/doctor/scheduler/${doctorId}`)
    }
    static async getScheduleByDate (doctorId, date) {
        return $api.get(`/api/doctor/scheduler/${doctorId}`, {params: {date: date}})
    }
    static async getScheduleByDateV2 (doctorId, date) {
        return $api.get(`/api/doctor/scheduler/date/${doctorId}`, {params: {date: date}})
    }
    
    static async getScheduleByDates (doctorId, startDate, endDate) {
        return $api.get(`/api/doctor/scheduler/${doctorId}`, {params: {startDate: startDate, endDate: endDate}})
    }

    static async deleteSchedule (id) {
        return $api.post('/api/doctor/scheduler/delete', {id})
    }
    
    static async addSchedule (doctorId, date, startTime, endTime) {
        return $api.post('/api/doctor/scheduler/dates/add', {doctorId, date, startTime, endTime })
    }
    static async updateSchedule (doctorId, slotId, date, startTime, endTime) {
        return $api.post(`/api/doctor/scheduler/dates/edit/${slotId}`, { doctorId, date, startTime, endTime })
    }

    
}
