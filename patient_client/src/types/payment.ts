import { SlotExtended } from "./consultaion";

export interface Payment {
    amount: number,
    createdAt: string,
    id: number,
    payTypeId: number,
    paymentDetails: string,
    paymentStatusId: number,
    slotId: number,
    updatedAt: string,
    userId: number,
    uuid4: string,
}

export interface PaymentInformationPageResponse {
    amount: number,
    createdAt: string,
    id: number,
    payTypeId: number,
    paymentDetails: string,
    paymentStatusId: number,
    slotId: number,
    updatedAt: string,
    userId: number,
    uuid4: string,
    Slot: SlotExtended,
    
}

export interface PaymentStatus {
    code: string,
    description: string
}