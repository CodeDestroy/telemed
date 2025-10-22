import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class DoctorService {

    static async getConsultations (userId, date) {
        return $api.get('/api/doctor/consultations/active', {params: {userId, date}});
    }

    static async getConsultationsByDoctorId (doctorId, date) {
        return $api.get('/api/doctor/v2/consultations/active', {params: {doctorId, date}});
    }

    static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    }

    static async getEndedConsultationsByDoctorId (doctorId) {
        return $api.get('/api/doctor/v2/consultations/ended', {params: {doctorId}})
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
    
    static async addSchedule (doctorId, date, startTime, endTime, price, isFree) {
        return $api.post('/api/doctor/scheduler/dates/add', {doctorId, date, startTime, endTime, price, isFree })
    }
    static async updateSchedule (doctorId, slotId, date, startTime, endTime, price, isFree) {
        return $api.post(`/api/doctor/scheduler/dates/edit/${slotId}`, { doctorId, date, startTime, endTime, price, isFree })
    }

    static async setProtocol (roomId, protocol) {
        return $api.post('/api/doctor/conference/protocol/set', {roomId, protocol})
    }

    static async sendProtocol (roomId) {
        return $api.post('/api/doctor/conference/protocol/send', {roomId})
    }

    static async getConsultationBySlotId(slotId) {
        return $api.get(`/api/doctor/v2/consultation/${slotId}`)
    }

    static async getFilesBySlotId(slotId) {
        return $api.get(`/api/patient/consultations/${slotId}/files`)
    }

    static async endConsultation(slotId, endTime) {
        return $api.post(`/api/doctor/consultation/${slotId}/setEnd`, {endTime})
    }
    
}
