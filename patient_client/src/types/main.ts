import { Doctor } from "./doctor";
import ScheduleMainPage from "./schedule";

export default interface DoctorListItemResponse {
    doctor: Doctor,
    /* schedule: ScheduleMainPage[] */
    schedule: string[]
    
}