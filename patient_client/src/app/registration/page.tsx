'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FormEvent, useState } from 'react'
import { useStore } from '@/store'
import AuthService from '@/services/auth'
import { useRouter } from 'next/navigation'
import { AxiosError } from '@/types/errors'
import Link from 'next/link'

const Registration = () => {
  const store = useStore()
  const [secondName, setSecondName] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [patronomicName, setPatronomicName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [snils, setSnils] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')

  const [agreePD, setAgreePD] = useState<boolean>(false)
  const [agreeConsent, setAgreeConsent] = useState<boolean>(false)

  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()

  const chechFormData = () => {
    const currError: string[] = []

    if (!secondName || secondName.length < 2) currError.push('Введите Фамилию')
    if (!firstName || firstName.length < 2) currError.push('Введите Имя')
    if (!phone || phone.length < 11 || phone.length > 13) currError.push('Введите Телефон')
    if (!email) currError.push('Введите Email')
    if (email.length < 2) currError.push('Email должен быть длиннее 2 символов')
    if (!password) currError.push('Введите Пароль')
    if (password.length < 3) currError.push('Пароль должен быть длиннее 3 символов')
    if (!snils || snils.length != 11) currError.push('Введите корректный СНИЛС')
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
    try {
      event.preventDefault()
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
          router.push(`/registration/registration-step3?phone=${response2.data[0]?.phone}`)
        }
      }
    } catch (e: unknown) {
      const err = e as AxiosError
      if (err.response?.data) setErrors([err.response.data])
      else if (e instanceof Error) setErrors([e.message])
      else setErrors(['Неизвестная ошибка'])
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-10 min-h-[calc(100vh-200px)] flex flex-col justify-start">
        <div className="space-y-10 divide-y divide-gray-900/10 flex-grow">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Регистрация</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Введите свои данные для регистрации</p>
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
                  <div className="sm:col-span-4">
                    <label htmlFor="second-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Фамилия*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setSecondName(e.target.value)}
                        id="second-name"
                        name="second-name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Имя*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setFirstName(e.target.value)}
                        id="first-name"
                        name="first-name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="patronomic-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Отчество
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setPatronomicName(e.target.value)}
                        id="patronomic-name"
                        name="patronomic-name"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Телефон*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="snils" className="block text-sm font-medium leading-6 text-gray-900">
                      СНИЛС*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setSnils(e.target.value)}
                        id="snils"
                        name="snils"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                      Дата рождения*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setBirthDate(e.target.value)}
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Пароль*
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                {/* ✅ ЧЕКБОКСЫ */}
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
                      <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/Доктор_Рядом_Перечень_Обрабатываемых_Персональных_Данных.pdf`} className="text-indigo-600 hover:underline">
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
                      <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_Положение_Информированное_Добровольное_Согласие_ТМК.pdf`} className="text-indigo-600 hover:underline">
                        добровольного информированного согласия{' '}
                      </Link>
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
