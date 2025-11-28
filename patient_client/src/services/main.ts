export const API_URL = process.env.REACT_APP_SERVER_URL
import { AxiosResponse } from 'axios'
import { $api } from '../api'
import DoctorListItemResponse from "@/types/main";
import Post from "@/types/posts";
import { consultaionPrice, createCunsultationResponse } from "@/types/consultaion";

export default class MainService {

    static async getDoctorList(date: Date, medOrgId: number | string | undefined, serviceId: number | null): Promise<AxiosResponse<DoctorListItemResponse[]>> {
        return $api.get<DoctorListItemResponse[]>('/api/patient/doctorList', {params: {dateStart: date, medOrgId, serviceId}})
    }

    static async getDoctor(id: number, date: Date, serviceId: number | undefined): Promise<AxiosResponse<DoctorListItemResponse>> {
        return $api.get<DoctorListItemResponse>('/api/patient/doctor', {params: {id, dateStart: date, serviceId}})
    }

    static async getPostsList(): Promise<AxiosResponse<Post[]>> {
        return $api.get<Post[]>('/api/patient/postsList')
    }

    //static async getDoctorSchedule(id: number): Promise<AxiosResponse<Date[]>> {}

    static async createConsultation(doctorId: number, patientId: number, startDateTime: string | Date, duration: number, childId: number | null): Promise<AxiosResponse<createCunsultationResponse>> {
        return $api.post<createCunsultationResponse>('/api/patient/consultations/create', {doctorId, patientId, startDateTime, duration, slotStatusId: 2, childId})
    }

    static async createConsultationV2(doctorId: number, patientId: number, scheduleId: number, childId: number | null): Promise<AxiosResponse<createCunsultationResponse>> {
        return $api.post<createCunsultationResponse>('/api/patient/v2/consultations/create', {doctorId, patientId, scheduleId, slotStatusId: 2, childId})
    }

    static async getConsultationPrice(doctorId: number, startDateTime: Date | string): Promise<AxiosResponse<consultaionPrice>> {
        return $api.post<consultaionPrice>('/api/patient/consultations/getPrice', {doctorId, startDateTime})
    }

    /* static async createSlot (doctor, patient, startDateTime, duration, slotStatusId) {
        return $api.post('/api/admin/consultations/create', {doctor, patient, startDateTime, duration, slotStatusId});
    } */

    static async getDoctorSchedule (doctorId: number, date: Date, serviceId: number | null | undefined): Promise<AxiosResponse> {
        return $api.get(`/api/patient/scheduler/date/${doctorId}`, {params: {date, serviceId}});
    }

    static async getDoctorConsultations (doctorId: number, date: Date): Promise<AxiosResponse> {
        return $api.get('/api/patient/consultations/active', {params: {doctorId, date}});
    }
    
}
