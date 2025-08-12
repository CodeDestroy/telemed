export interface LoginRequest {
  login: string
  password: string
}
import {User} from '@/types/user'
export interface AuthResponse {
  token: string
  user: User
}

export interface RegistrationRequest {
  role_id: number
  secondName: string
  firstName: string
  patronomicName: string
  tabelNum: string
  phone: string
  email: string
  birthDate: string
  gender: string
  postId: number
  login: string
  password: string
}

export interface ConfirmRegistrationRequest {
  secondName: string
  name: string
  patronomicName: string
  birthDate: string
  email: string
  phone: string
  password: string
  snils: string
}