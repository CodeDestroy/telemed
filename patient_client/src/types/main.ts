import { Doctor } from "./doctor";
import { ScheduleShort } from "./schedule";

export default interface DoctorListItemResponse {
    doctor: Doctor,
    /* schedule: ScheduleMainPage[] */
    schedule: ScheduleShort[]
    
}