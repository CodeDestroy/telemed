import MedicalOrg from "./medicalOrg";
import Post from "./posts";

export interface Doctor {
  id: number,
  userId: string | null,
  secondName: string,
  firstName: string,
  patronomicName: string | null,
  birthDate: string | null,
  snils: string | null,
  Post: Post | null
  info: string | null,
  MedOrg: MedicalOrg | null,
}