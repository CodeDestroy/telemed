import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {User} from "@/types/user";
import Post from "@/types/posts";
import { Child } from "@/types/child";

export default class UserService {

    static async updateUser(user: User): Promise<AxiosResponse<User>> {
        return $api.post<User>('/api/patient/consultations', {user})
    }

    static async getChildren(patientId: number | undefined): Promise<AxiosResponse<Child[]>> {
        return $api.get<Child[]>(`/api/patient/${patientId}/children`)
    }

    static async addChildren(child: Child): Promise<AxiosResponse<Child>> {
        return $api.post<Child>('/api/patient/children', {child})
    }

    static async removeChild(childId: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/api/patient/children/${childId}`)
    }

   


    
}
