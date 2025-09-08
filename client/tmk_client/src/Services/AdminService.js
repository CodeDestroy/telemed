import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class AdminService {

    static async getConsultations (personId) {
        return $api.get('/api/admin/consultations/all', {params: {personId}});
    }

    static async getConsultationsByDate (date) {
        return $api.get('/api/admin/consultations/date', {params: {date}});
    }

    static async getEndedConsultations (userId) {
        return $api.get('/api/admin/consultations/ended', {params: {userId}})
    }

    static async getPatients() {
        return $api.get('/api/admin/patients/all');
    }

    static async getPatient(patientId) {
        return $api.get(`/api/admin/patients/${patientId}`);
    }

    static async editPatient(patientId, patient) {
        return $api.post(`/api/admin/patients/${patientId}`, {user: patient});
    }
    

    static async getDoctors(profileId = null) {
        return $api.get('/api/admin/doctors/all', {params: {profileId}});
    }

    static async getDoctor(doctorId) {
        return $api.get(`/api/admin/doctors/${doctorId}`);
    }
    
    static async editDoctor(doctorId, doctor) {
        return $api.post(`/api/admin/doctors/${doctorId}`, {user: doctor});
    }


    static async createDoctor(formData, profileId = null) {
        return $apiMultipartData.post('/api/admin/doctors/create', formData, {params: {profileId}});
    }

    static async createPatient(formData) {
        return $apiMultipartData.post('/api/admin/patients/create', formData);
    }

    static async createSlot (doctor, patient, startDateTime, duration, slotStatusId) {
        return $api.post('/api/admin/consultations/create', {doctor, patient, startDateTime, duration, slotStatusId});
    }
    //slotId, doctor, patient, startDateTime, duration, slotStatusId
    static async editSlot (slotId, doctor, patient, startDateTime, duration, slotStatusId) {
        return $api.post('/api/admin/consultations/edit', {slotId, doctor, patient, startDateTime, duration, slotStatusId});
    }

    static async getSlotStatuses () {
        return $api.get('/api/admin/slotStatuses/all');
    }
}
