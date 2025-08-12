import { Doctor } from "./doctor"
import { Patient } from "./patient"
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
    postName: string | undefined
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
    Doctor: Doctor
}