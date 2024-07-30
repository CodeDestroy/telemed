import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class DoctorService {

    static async getConsultations (userId) {
        return $api.get('/api/doctor/consultations/active', {params: {userId}});
    }

    static async getEndedConsultations (userId) {
        return $api.get('/api/doctor/consultations/ended', {params: {userId}})
    }
}
