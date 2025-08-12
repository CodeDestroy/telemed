import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {ConsultationFull, SlotWithRoomPatient} from "@/types/consultaion";
import Post from "@/types/posts";

export default class ConsultationService {

    static async getPreviousConsultations(userId: number | undefined): Promise<AxiosResponse<ConsultationFull[]>> {
        return $api.get<ConsultationFull[]>('/api/patient/consultations', {params: {userId}})
    }

    static async getConsultationById(id: number): Promise<AxiosResponse<SlotWithRoomPatient>> {
        return $api.get<SlotWithRoomPatient>('/api/patient/consultation', {params: {id}})
    }


    
}
