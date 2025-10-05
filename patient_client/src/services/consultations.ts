import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {ConsultationFull, SlotWithRoomPatient, Url} from "@/types/consultaion";
import Post from "@/types/posts";

export default class ConsultationService {

    static async getPreviousConsultations(userId: number | undefined): Promise<AxiosResponse<ConsultationFull[]>> {
        return $api.get<ConsultationFull[]>('/api/patient/consultations', {params: {userId, previous: true}})
    }

    static async getCurrentConsultations(userId: number | undefined): Promise<AxiosResponse<ConsultationFull[]>> {
        return $api.get<ConsultationFull[]>('/api/patient/consultations', {params: {userId, previous: false}})
    }

    static async getConsultationById(id: number): Promise<AxiosResponse<SlotWithRoomPatient>> {
        return $api.get<SlotWithRoomPatient>('/api/patient/consultation', {params: {id}})
    }

    static async getConsultationUrl(slotId: number, userId: number): Promise<AxiosResponse<Url>> {
        return $api.get<Url>('/api/patient/consultation/url', {params: {slotId, userId}})
    }

    static async uploadFile(slotId: number, file: File, patientId: number | undefined) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("patientId", patientId ? patientId.toString() : "");
        return $api.post(`/api/patient/consultations/${slotId}/files`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    static async getFiles(slotId: number) {
        return $api.get(`/api/patient/consultations/${slotId}/files`);
    }


    
}
