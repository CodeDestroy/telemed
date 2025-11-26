import { Doctor } from "./doctor"
import { Patient } from "./patient"
import { Payment } from "./payment"
import { Room } from "./room"

export interface ConsultationFull {
    birthDate: string | undefined,
    createdAt: string | undefined,
    dFirstName: string | undefined,
    dPatronomicName: string | undefined,
    dSecondName: string | undefined,
    dUrl: string | undefined,
    doctorId: number | undefined,
    ended: boolean | undefined,
    firstName: string | undefined,
    id: number,
    info: string | undefined,
    isBusy: boolean | undefined,
    medOrgId: number | undefined,
    meetingEnd: string | undefined,
    meetingStart: string | undefined,
    originalUrl: string | undefined,
    pFirstName: string | undefined,
    pPatronomicName: string | undefined,
    pSecondName: string | undefined,
    pUrl: string | undefined,
    patientId: number | undefined,
    patronomicName: string | undefined,
    postId: number | undefined,
    protocol: string | undefined,
    roomId: number,
    roomName: string | undefined,
    secondName: string | undefined,
    serviceId: number | undefined,
    shortUrl: string | undefined,
    slotEndDateTime: string | undefined,
    slotId: number,
    slotStartDateTime: string | undefined,
    slotStatusId: number | undefined,
    snils: string | undefined,
    token: string | undefined,
    type: string | undefined,
    updatedAt: string | undefined,
    userId: number | undefined,
    postName: string | undefined,
    avatar: string | undefined
}

export interface PatientConsultationInfo {
    id: number,
    complaints: string,
    diagnosis: string,
    anamnesis: string,
    comments: string,
    slotId: number,
    createdAt: string,
    updatedAt: string
}

export interface SlotWithRoomPatient {

    createdAt: string,
    doctorId: number,
    id: number,
    isBusy: boolean,
    patientId: number,
    serviceId: number,
    slotEndDateTime: string,
    slotStartDateTime: string,
    slotStatusId: number,
    updatedAt: string,
    Room: Room
    Patient: Patient
    Doctor: Doctor,
    Payment: Payment,
    PatientConsultationInfo?: PatientConsultationInfo
}

export interface Url {
    originalUrl: string
    shortUrl: string
    userId: number
    roomId: number
    type: number
    Room: Room
    
}

export interface Slot {
    slotStartDateTime: string
    slotEndDateTime: string
    serviceId: number
    isBusy: boolean
    patientId: number
    slotStatusId: number
    doctorId: number
}

export interface ScheduleSlot {
    /* scheduleStartTime: string
    scheduleEndTime: string
    serviceId: number
    isBusy: boolean
    patientId: number
    slotStatusId: number
    doctorId: number */


    doctorId: number
    id: number
    scheduleDayId: number
    scheduleEndTime: string
    scheduleServiceTypeId: number | null
    scheduleStartTime: string
    scheduleStatus: number | null
    updatedAt: string

    
}

export interface SlotExtended {
    id: number,
    slotStartDateTime: string
    slotEndDateTime: string
    serviceId: number
    isBusy: boolean
    Patient: Patient
    slotStatusId: number
    Doctor: Doctor
}

export interface createCunsultationResponse {
    doctorShortUrl: string,
    patientShortUrl: string,
    newSlot: Slot,
    newPayment: Payment,
    newRoom: Room
}

export interface consultaionPrice {
    price: string | number | null
    createdAt: string
    endDate: string
    id: number
    isFree: boolean | null
    scheduleId: number
    startDate: string
    updatedAt: string
}