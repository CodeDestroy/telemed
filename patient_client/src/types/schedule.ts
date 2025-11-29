import WeekDay from "./weekDay";
export interface SchedulePrice {
    price: number | string,
    isFree: boolean,
    startDate: Date | null | string,
    endDate: Date | null | string,
}
export interface ScheduleMainPage {
    WeekDay: WeekDay,
    date: string | null,
    doctorId: number,
    id: number,
    isBusy: boolean | null,
    scheduleDayId: number,
    scheduleEndTime: string,
    scheduleServiceTypeId: number | null,
    scheduleStartTime: string,
    scheduleStatus: number,
    updatedAt: string,
    slotId: number | null,
    SchedulePrices: SchedulePrice[] | null
}


export interface ScheduleShort {
    date: string,
    name: string,
    scheduleEndTime: string,
    scheduleStartTime: string,
} 