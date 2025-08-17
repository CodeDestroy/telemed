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

    //static async getDoctorSchedule(id: number): Promise<AxiosResponse<Date[]>> {}

    static async createConsultation(doctorId: number, patientId: number, startDateTime: string | Date, duration: number): Promise<AxiosResponse> {
        return $api.post('/api/patient/consultations/create', {doctorId, patientId, startDateTime, duration, slotStatusId: 2})
    }

    /* static async createSlot (doctor, patient, startDateTime, duration, slotStatusId) {
        return $api.post('/api/admin/consultations/create', {doctor, patient, startDateTime, duration, slotStatusId});
    } */

    static async getDoctorSchedule (doctorId: number, date: Date): Promise<AxiosResponse> {
        return $api.get(`/api/patient/scheduler/date/${doctorId}`, {params: {date}});
    }

    static async getDoctorConsultations (doctorId: number, date: Date): Promise<AxiosResponse> {
        return $api.get('/api/patient/consultations/active', {params: {doctorId, date}});
    }
    
}
