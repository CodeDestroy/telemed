import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import DoctorListItemResponse from "@/types/main";
import Post from "@/types/posts";

export default class AuthService {

    static async getDoctorList(): Promise<AxiosResponse<DoctorListItemResponse[]>> {
        return $api.get<DoctorListItemResponse[]>('/api/patient/doctorList')
    }

    static async getPostsList(): Promise<AxiosResponse<Post[]>> {
        return $api.get<Post[]>('/api/patient/postsList')
    }

    
}
