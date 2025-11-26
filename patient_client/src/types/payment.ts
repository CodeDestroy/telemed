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
    yookassa_id: string,
    yookassa_status: string,
    yookassa_payment_method_type: string,
    yookassa_confirmation_url: string
    
}

export interface PaymentStatus {
    code: string,
    description: string
}