import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class AdminService {

    static async getConsultations () {
        return $api.get('/api/admin/consultations/all');
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

    static async getDoctors() {
        return $api.get('/api/admin/doctors/all');
    }

    static async getDoctor(doctorId) {
        return $api.get(`/api/admin/doctors/${doctorId}`);
    }

    static async createDoctor(formData) {
        return $apiMultipartData.post('/api/admin/doctors/create', formData);
    }

    static async createPatient(formData) {
        return $apiMultipartData.post('/api/admin/patients/create', formData);
    }

    static async createSlot (doctor, patient, startDateTime, duration) {
        return $api.post('/api/admin/consultations/create', {doctor, patient, startDateTime, duration});
    }
}
