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

    
}
