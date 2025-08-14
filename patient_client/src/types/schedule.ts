import WeekDay from "./weekDay";

export default interface ScheduleMainPage {
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