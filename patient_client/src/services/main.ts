import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import DoctorListItemResponse from "@/types/main";
import Post from "@/types/posts";

export default class MainService {

    static async getDoctorList(date: Date): Promise<AxiosResponse<DoctorListItemResponse[]>> {
        return $api.get<DoctorListItemResponse[]>('/api/patient/doctorList', {params: {dateStart: date}})
    }

    static async getDoctor(id: number, date: Date): Promise<AxiosResponse<DoctorListItemResponse>> {
        return $api.get<DoctorListItemResponse>('/api/patient/doctor', {params: {id, dateStart: date}})
    }

    static async getPostsList(): Promise<AxiosResponse<Post[]>> {
        return $api.get<Post[]>('/api/patient/postsList')
    }

    
}
