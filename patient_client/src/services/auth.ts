import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {AuthResponse, RegistrationRequest, ConfirmRegistrationRequest} from "@/types/auth"

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

    static async confirmRegistration(data: ConfirmRegistrationRequest): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/confirm-registration', data)
    }

    static async confirmEmail(phone: string, code: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/confirm-email', { phone, code })
    }

    static async setPassword(userId: number, password: string): Promise<AxiosResponse<void>> {
        return $api.post(`/api/user/${userId}/setPassword`, { password })
    }

    
}
