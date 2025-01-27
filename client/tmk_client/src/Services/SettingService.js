import {$api, $apiMultipartData} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class SettingService {

    static async setSheduleType (type, userId) {
        return $api.post('/api/doctor/scheduler/setScheduleType', {type, userId});
    }

    
}
