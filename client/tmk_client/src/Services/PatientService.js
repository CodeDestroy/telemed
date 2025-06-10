import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class PatientService {

    static async getProtocol (roomName) {
        return $api.get('/api/patient/consultations/protocol', {params: {roomName}});
    }

        
}
