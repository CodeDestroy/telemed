import { Child } from "./child"

export interface Room {
    createdAt: string,
    ended: string | null,
    id: number,
    meetingEnd: string | null,
    meetingStart: string,
    protocol: string | null,
    roomName: string,
    slotId: number,
    token: string | null,
    updatedAt: string,
    childId: number | null
    Child?: Child
}