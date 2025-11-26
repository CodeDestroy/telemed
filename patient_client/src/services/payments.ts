import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {PaymentInformationPageResponse, PaymentStatus} from "@/types/payment";
import Post from "@/types/posts";

export default class PaymentService {

    static async getPaymentInformation(uuid: string | undefined): Promise<AxiosResponse<PaymentInformationPageResponse>> {
        return $api.get<PaymentInformationPageResponse>('/api/payment', {params: {uuid}})
    }

    
    static async getPaymentsByUserId(userId: number | undefined): Promise<AxiosResponse<PaymentInformationPageResponse[]>> {
        return $api.get<PaymentInformationPageResponse[]>('/api/payment/all', {params: {userId}})
    }

    static async getPaymentStatuses(): Promise<AxiosResponse<PaymentStatus[]>> {
        return $api.get<PaymentStatus[]>('/api/payment/statuses')
    }

    static async checkPayment(uuid: string): Promise<AxiosResponse<PaymentInformationPageResponse>> {
        return $api.get<PaymentInformationPageResponse>('/api/payment/checkPaymentStatus', {params: {uuid}})
    }

    static async createYookassaPayment(uuid: string, payment_method_data: string | null): Promise<AxiosResponse<PaymentInformationPageResponse>> {
        return $api.post<PaymentInformationPageResponse>('/api/payment/yookassa', {uuid, payment_method_data})
    }

    
}
