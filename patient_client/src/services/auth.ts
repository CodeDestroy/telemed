import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {AuthResponse, RegistrationRequest, ConfirmRegistrationRequest, RegistrationResponse} from "@/types/auth"
import { User } from "@/types/user";

export default class AuthService {

    static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/login', { login, password })
    }

    static async refresh(): Promise<AxiosResponse<AuthResponse>> {
        return $api.get<AuthResponse>('/api/refresh')
    }

    static async registration(data: RegistrationRequest): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/registration', data)
    }

    static async logout(): Promise<AxiosResponse<void>> {
        return $api.get('/api/logout')
    }

    static async checkPhone(phone: string): Promise<AxiosResponse<{ exists: boolean }>> {
        return $api.get('/api/check-phone', { params: { phone } })
    }

    static async confirmRegistration(secondName: string, name: string, patronomicName: string, birthDate: string, email: string, phone: string, password: string, snils: string): Promise<AxiosResponse<RegistrationResponse>> {
        return $api.post<RegistrationResponse>('/api/confirm-registrationPatient', {secondName, name, patronomicName, birthDate, email, phone, password, snils})
    }

    static async confirmEmail(phone: string | null, code: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/confirm-email', { phone, code })
    }

    static async setPassword(userId: number, password: string): Promise<AxiosResponse<void>> {
        return $api.post(`/api/user/${userId}/setPassword`, { password })
    }

    static async updateUser(user: User): Promise<AxiosResponse<User>> {
        return $api.post<User>('/api/user/changeUser', {user})
    }

    
}
