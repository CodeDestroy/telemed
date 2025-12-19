// src/store/store.ts
import { makeAutoObservable } from 'mobx'
import AuthService from '@/services/auth'
import {User} from "@/types/user"
import { AxiosError } from '@/types/errors'
const doctorClient = process.env.NEXT_PUBLIC_CLIENT_URL
export default class Store {
  user: User | null = null
  isAuth: boolean = false
  isLoading: boolean = false
  error: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(isAuth: boolean) {
    this.isAuth = isAuth
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading
  }

  setUser(user: User | null) {
    this.user = user
  }

  setError(error: string) {
    this.error = error
  }
 login = async (login: string, password: string) => {
    this.setLoading(true)
    try {
      const response = await AuthService.login(login, password)
      if (response.status === 200) {
        const tempUser = response.data.user;
        if (tempUser.accessLevel > 1) {
            this.setLoading(false)
            const res = {
                data: 'Запрещён вход не для пациентов',
                redirect: doctorClient,
            }
             
            /* Тут сделать предупреждение */
            /* window.location.href = doctorClient as string */
            this.setError('Запрещён вход не для пациентов')
            return res
        }
        this.setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        this.setAuth(true)
        return response
      } else {
        this.setError('Неизвестная ошибка')
        return { response: { data: 'Неизвестная ошибка' } }
      }
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setError(err.response?.data || 'Ошибка запроса')
      return err
    } finally {
      this.setLoading(false)
    }
  }

  registrationByCode = async (phone: string, code: string) => {
    this.setLoading(true)
    try {
      const response = await AuthService.confirmEmail(phone.trim(), code.trim())
      this.setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      this.setAuth(true)
      return response
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setError(err.response?.data || 'Ошибка регистрации')
      return e
    } finally {
      this.setLoading(false)
    }
  }

  logout = async () => {
    try {
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser(null)
      this.setError('')
    } catch (e: unknown) {
      const err = e as AxiosError
      console.error(err)
    }
  }

  refreshStore = async () => {
    this.setLoading(true)
    try {
      this.setUser(this.user)
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setError(err.response?.data || 'Ошибка при обновлении')
    } finally {
      this.setLoading(false)
    }
  }

  checkAuth = async (): Promise<boolean> => {
    this.setLoading(true)
    try {
      const response = await AuthService.refresh()
      const tempUser = response.data.user;
        if (tempUser.accessLevel > 1) {
            this.setLoading(false)
            const res = {
                data: 'Запрещён вход не для пациентов',
                redirect: doctorClient,
            }
            /* Тут сделать предупреждение */
            /* window.location.href = doctorClient as string */
            this.setError('Запрещён вход не для пациентов')
            return false
      }
      localStorage.setItem('token', response.data.token)
      this.setUser(response.data.user)
      this.setAuth(true)
      return true
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setUser(null)
      this.setAuth(false)
      this.setError(err.response?.data || 'Не авторизован')
      localStorage.removeItem('token')
      return false
    } finally {
      this.setLoading(false)
    }
  }

  sendRecoveryCode = async (phone: string) => {
    try {
      await AuthService.sendRecoveryCode(phone)
      return true
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setUser(null)
      this.setAuth(false)
      this.setError(err.response?.data || 'Ошибка отправки кода')
      localStorage.removeItem('token')
      throw e
    } finally {
      this.setLoading(false)
    }
  }

  resetPassword = async (phone: string, code: string, password: string) => {
    try {
      await AuthService.resetPassword(phone, code, password)
      return true
    } catch (e: unknown) {
      const err = e as AxiosError
      this.setUser(null)
      this.setAuth(false)   
      this.setError(err.response?.data || 'Ошибка при сбросе пароля')
      localStorage.removeItem('token')
      throw e
    } finally {
      this.setLoading(false)
    }

  
  }
}
