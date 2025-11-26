import WeekDay from "./weekDay";

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
}


export interface ScheduleShort {
    date: string,
    name: string,
    scheduleEndTime: string,
    scheduleStartTime: string,
} 