import {$api} from "../api";

//import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {

    static async login (login, password) {
        return $api.post('/api/login', {login, password});
    }

    static async refresh () {
        return $api.get('/api/refresh');
    }

    //был post
    static async registrarion (role_id, secondName, firstName, patronomicName, tabelNum, phone, email, birthDate,  gender,  postId, login, password){
        return $api.post('/api/registration', {role_id, secondName, firstName, patronomicName, tabelNum, phone, email, birthDate,  gender,  postId, login, password});
    }

    //был post, Но лучше оставить get
    static async logout () {
        return $api.get('/api/logout');
    }

    static async checkPhone(phone) {
        return $api.get('/api/check-phone', {params: {phone}});
    }

    static async confirmRegistration (secondName, name, patronomicName, birthDate, email, phone, password, snils) {
        return $api.post('/api/confirm-registration', {secondName, name, patronomicName, birthDate, email, phone, password, snils});
    }

    static async confirmEmail (phone, code ) {
        return $api.post('/api/confirm-email', {phone, code});
    }

    static async setPassword(userId, password) {
        return $api.post(`/api/user/${userId}/setPassword`, {password});
    }

    static async sendRecoveryCode(phone) {
        return $api.post(`/api/user/send-recovery-code`, {phone});
    }

    static async resetPassword(phone, code, password) {
        return await $api.post('/api/user/reset-password', { phone, code, password })
    }

    
}
