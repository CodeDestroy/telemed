import axios from "axios";
export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import {User} from "@/types/user";
import Post from "@/types/posts";

export default class UserService {

    static async updateUser(user: User): Promise<AxiosResponse<User>> {
        return $api.post<User>('/api/patient/consultations', {user})
    }

   


    
}
