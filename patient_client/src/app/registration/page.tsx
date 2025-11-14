'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useStore } from '@/store'
import AuthService from '@/services/auth'
import { useRouter } from 'next/navigation'
import { AxiosError } from '@/types/errors'
import Link from 'next/link'
import Loader from '@/components/Loader'
import { IMaskInput } from 'react-imask'

const Registration = () => {
  const store = useStore()
  const [secondName, setSecondName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [patronomicName, setPatronomicName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [formattedPhone, setFormattedPhone] = useState('') // для отображения:
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('') // ✅ добавлено
  const [snils, setSnils] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')

  const [agreePD, setAgreePD] = useState<boolean>(false)
  const [agreeConsent, setAgreeConsent] = useState<boolean>(false)

  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const phoneRef = useRef<HTMLInputElement>(null)
  // ✅ состояния для показа/скрытия пароля
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const toggleShowPass = () => setShowPass(!showPass)
  const toggleShowConfirmPass = () => setShowConfirmPass(!showConfirmPass)

  const chechFormData = () => {
    const currError: string[] = []

    if (!secondName || secondName.length < 2) currError.push('Введите Фамилию')
    if (!firstName || firstName.length < 2) currError.push('Введите Имя')
    if (!phone || phone.length < 11 || phone.length > 13) currError.push('Введите Телефон')
    if (!email) currError.push('Введите Email')
    if (email.length < 2) currError.push('Email должен быть длиннее 2 символов')
    if (!password) currError.push('Введите Пароль')
    if (password.length < 3) currError.push('Пароль должен быть длиннее 3 символов')
    if (!confirmPassword) currError.push('Введите Подтверждение пароля')
    if (password !== confirmPassword) currError.push('Пароли не совпадают')
    /* if (!snils || snils.length !== 11) currError.push('Введите корректный СНИЛС') */
    if (!birthDate) currError.push('Введите Дату рождения')

    if (!agreePD) currError.push('Необходимо согласие на обработку персональных данных')
    if (!agreeConsent) currError.push('Необходимо согласие с информированным согласием')

    if (currError.length > 0) {
      setErrors(currError)
      return false
    }

    setErrors([])
    return true
  }

  const registration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setLoading(true)
      setErrors([])

      if (chechFormData()) {
        const response1 = await AuthService.checkPhone(phone)
        if (!response1.data) {
          const response2 = await AuthService.confirmRegistration(
            secondName,
            firstName,
            patronomicName,
            birthDate,
            email,
            phone,
            password,
            snils
          )
          setLoading(false)
          router.push(`/registration/registration-step3?phone=${response2.data[0]?.phone}`)
        } else {
          setLoading(false)
          setErrors(['Этот номер телефона уже зарегистрирован'])
        }
      } else {
        setLoading(false)
      }
    } catch (e: unknown) {
      setLoading(false)
      const err = e as AxiosError
      if (err.response?.data) setErrors([err.response.data])
      else if (e instanceof Error) setErrors([e.message])
      else setErrors(['Неизвестная ошибка'])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-10 min-h-[calc(100vh-200px)] flex flex-col justify-start">
        <div className="space-y-10 divide-y divide-gray-900/10 flex-grow">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Регистрация</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Введите свои данные для регистрации
              </p>
            </div>

            <form
              onSubmit={registration}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                {errors.length > 0 && (
                  <ul className="mb-4">
                    {errors.map((err, i) => (
                      <li key={i} className="text-red-600 text-sm font-medium">
                        {err}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Фамилия */}
                  <div className="sm:col-span-3">
                    <label htmlFor="second-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Фамилия*
                    </label>
                    <div className="mt-2">
                      <input
                        id="second-name"
                        name="second-name"
                        type="text"
                        autoComplete="family-name"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Имя */}
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Имя*
                    </label>
                    <div className="mt-2">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Отчество */}
                  <div className="sm:col-span-3">
                    <label htmlFor="patronymic" className="block text-sm font-medium leading-6 text-gray-900">
                      Отчество
                    </label>
                    <div className="mt-2">
                      <input
                        id="patronymic"
                        name="patronymic"
                        type="text"
                        value={patronomicName}
                        onChange={(e) => setPatronomicName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Телефон */}
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Телефон*
                    </label>
                    <div className="mt-2">
                      {/* <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="89991234567"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      /> */}
                    
                    {mounted && (
                        <IMaskInput
                            mask="+7 (000) 000-00-00"
                            value={formattedPhone}
                            onAccept={(value: string) => {
                                const digits = value.replace(/\D/g, '')
                                const normalized = digits.startsWith('8') ? digits.slice(1) : digits
                                setPhone(normalized)
                                setFormattedPhone(value)
                            }}
                            overwrite
                            unmask={false} // сохраняем отображаемое значение
                            // Для ref если нужно
                            inputRef={phoneRef}
                            // обычные пропсы input
                            className="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                        />
                    )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email*
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@mail.ru"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* СНИЛС */}
                  <div className="sm:col-span-3">
                    <label htmlFor="snils" className="block text-sm font-medium leading-6 text-gray-900">
                      СНИЛС
                    </label>
                    <div className="mt-2">
                      <input
                        id="snils"
                        name="snils"
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        value={snils}
                        onChange={(e) => setSnils(e.target.value.replace(/\D/g, ''))}
                        placeholder="11223344595"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Дата рождения */}
                  <div className="sm:col-span-3">
                    <label htmlFor="birth-date" className="block text-sm font-medium leading-6 text-gray-900">
                      Дата рождения*
                    </label>
                    <div className="mt-2">
                      <input
                        id="birth-date"
                        name="birth-date"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Пароль */}
                  <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Пароль*
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={toggleShowPass}
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                      >
                        {showPass ? 
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400"  data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                          </svg>
                          :
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"></path>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>

                  {/* Подтверждение пароля */}
                  <div className="sm:col-span-3">
                    <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                      Подтверждение пароля*
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={toggleShowConfirmPass}
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPass ? 
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400"  data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                          </svg>
                          :
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"></path>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* чекбоксы */}
                <div className="mt-8 space-y-4">
                  <label className="flex items-start gap-x-3">
                    <input
                      type="checkbox"
                      checked={agreePD}
                      required
                      onChange={(e) => setAgreePD(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm leading-6 text-gray-700">
                      Я ознакомлен(а) и согласен(а) с{' '}
                      <Link
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/Доктор_Рядом_Перечень_Обрабатываемых_Персональных_Данных.pdf`}
                        className="text-indigo-600 hover:underline"
                      >
                        правилами обработки персональных данных
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-x-3">
                    <input
                      required
                      type="checkbox"
                      checked={agreeConsent}
                      onChange={(e) => setAgreeConsent(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm leading-6 text-gray-700">
                      Я ознакомлен(а) с условиями{' '}
                      <Link
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_Положение_Информированное_Добровольное_Согласие_ТМК.pdf`}
                        className="text-indigo-600 hover:underline"
                      >
                        добровольного информированного согласия
                      </Link>{' '}
                      и принимаю их.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                  Отмена
                </Link>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Registration
