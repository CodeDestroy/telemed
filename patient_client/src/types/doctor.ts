import MedicalOrg from "./medicalOrg";
import Post from "./posts";
import { User } from "./user";

export interface Doctor {
  id: number,
  userId: string | null,
  secondName: string,
  firstName: string,
  patronomicName: string | null,
  birthDate: string | null,
  snils: string | null,
  Posts: Post[] | null
  info: string | null,
  MedOrg: MedicalOrg | null,
  User: User | null
}