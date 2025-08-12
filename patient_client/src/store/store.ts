// src/store/store.ts
import { makeAutoObservable } from 'mobx'
import AuthService from '@/services/auth'
import {User} from "@/types/user"

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

  /* async login(login: string, password: string) {
    this.setLoading(true)
    try {
      const response = await AuthService.login(login, password)

      if (response.status === 200) {
        this.setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        this.setAuth(true)
        return response
      } else {
        this.setError('Неизвестная ошибка')
        return { response: { data: 'Неизвестная ошибка' } }
      }
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка запроса')
      return e
    } finally {
      this.setLoading(false)
    }
  }

  async registrationByCode(phone: string, code: string) {
    this.setLoading(true)
    try {
      const response = await AuthService.confirmEmail(phone.trim(), code.trim())
      this.setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      this.setAuth(true)
      return response
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка регистрации')
      return e
    } finally {
      this.setLoading(false)
    }
  }

  async logout() {
    try {
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser(null)
      this.setError('')
    } catch (e) {
      console.error(e)
    }
  }

  async refreshStore() {
    this.setLoading(true)
    try {
      this.setUser(this.user)
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка при обновлении')
    } finally {
      this.setLoading(false)
    }
  }

  async checkAuth(): Promise<boolean> {
    this.setLoading(true)
    try {
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.token)
      this.setUser(response.data.user)
      this.setAuth(true)
      return true
    } catch (e: any) {
      this.setUser(null)
      this.setAuth(false)
      this.setError(e.response?.data || 'Не авторизован')
      localStorage.removeItem('token')
      return false
    } finally {
      this.setLoading(false)
    }
  } */
 login = async (login: string, password: string) => {
    this.setLoading(true)
    try {
      const response = await AuthService.login(login, password)

      if (response.status === 200) {
        this.setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        this.setAuth(true)
        return response
      } else {
        this.setError('Неизвестная ошибка')
        return { response: { data: 'Неизвестная ошибка' } }
      }
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка запроса')
      return e
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
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка регистрации')
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
    } catch (e) {
      console.error(e)
    }
  }

  refreshStore = async () => {
    this.setLoading(true)
    try {
      this.setUser(this.user)
    } catch (e: any) {
      this.setError(e.response?.data || 'Ошибка при обновлении')
    } finally {
      this.setLoading(false)
    }
  }

  checkAuth = async (): Promise<boolean> => {
    this.setLoading(true)
    try {
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.data.token)
      this.setUser(response.data.user)
      this.setAuth(true)
      return true
    } catch (e: any) {
      this.setUser(null)
      this.setAuth(false)
      this.setError(e.response?.data || 'Не авторизован')
      localStorage.removeItem('token')
      return false
    } finally {
      this.setLoading(false)
    }
  }
}
