import $api from "../api";

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
}
