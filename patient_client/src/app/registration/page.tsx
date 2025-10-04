'use client'
import Header from '@/components/Header'
import { FormEvent, useState } from 'react'

import { useStore } from '@/store'
import AuthService from '@/services/auth'

import { useRouter } from 'next/navigation'
import { AxiosError } from '@/types/errors'
import Link from 'next/link'
import Footer from '@/components/Footer'
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

    const [errors, setErrors] = useState<string[]>([])

    
    const router = useRouter()

    const chechFormData = () => {
        let currErrorIndicator = false
        const currError: string[] = []
        if (!secondName || secondName.length < 2) {
            
            currError.push('Введите Фамилию')
            currErrorIndicator = true
        }
        if (!firstName|| firstName.length < 2) {
            currError.push('Введите Имя')
            currErrorIndicator = true
        }
        if (!phone || phone.length < 11 || phone.length > 13){
            currError.push('Введите Телефон')
            currErrorIndicator = true
        }
        if (!email ) {
            currError.push('Введите Email')
            currErrorIndicator = true
        }
        if (email.length < 2) {
            currError.push('Email должен быть длиннее 2 символов')
            currErrorIndicator = true
        }
        
        if (!password) {
            currError.push('Введите Пароль')
            currErrorIndicator = true
        }
        if (password.length < 3) {
            currError.push('Пароль должен быть длиннее 3 символов')
            currErrorIndicator = true
        }
        if (!snils || snils.length != 11) {
            currError.push('Введите корректный СНИЛС')
            currErrorIndicator = true
        }
        if (!birthDate) {
            currError.push('Введите Дату рождения')
            currErrorIndicator = true
        }
        
        if (currErrorIndicator){
            /* setError(error ? error : '' + (`\n\n${currError}`)) */
            
            setErrors(currError)
            return false
        }
        setErrors([])
        return true
    }

    const registration = async (event: FormEvent<HTMLFormElement>) => {
        try {
            setErrors([])
            event.preventDefault()
            if (chechFormData()) {
               console.log(secondName, firstName, patronomicName, phone, email, password, snils, birthDate)
                const response1 = await AuthService.checkPhone(phone)
                if (!response1.data) {
                    const response2 = await AuthService.confirmRegistration(secondName, firstName, patronomicName, birthDate, email, phone, password, snils)
                    router.push(`/registration/registration-step3?phone=${response2.data[0]?.phone}`)
                    //http://localhost:3000/registration/registration-step3?phone=88005553533&code=4978
                    console.log(response2)
                } 
            }
            
            
        }
        catch (e: unknown) {
            const err = e as AxiosError
            if (err.response?.data) {
                setErrors([err.response.data])
            } else if (e instanceof Error) {
                setErrors([e.message])
            } else {
                setErrors(["Неизвестная ошибка"])
            }
        }
    }



  return (
    <>
        <Header/>
        <div className='container mx-auto px-10'>
            <div className="space-y-10 divide-y divide-gray-900/10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Регистрация</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Введите свои данные для регистрации</p>
                    </div>

                    <form onSubmit={registration} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            {errors && errors.length > 0 ?
                                    
                                    <div className="w-full"> 
                                        {/* <p className="text-red-800 block text-sm font-medium leading-6 text-gray-900" style={{ whiteSpace: "pre-line" }}>
                                            {error}
                                        </p> */}
                                        <ul>
                                            {errors.map((err, i) => (
                                                <li className="text-red-800 block text-sm font-medium leading-6 text-gray-900" key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    : 
                                    ''
                                }
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                
                                <div className="sm:col-span-4">
                                    <label htmlFor="second-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Фамилия*
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onChange={(e) => {setSecondName(e.target.value)}}
                                            id="second-name"
                                            name="second-name"
                                            type="text"
                                            required
                                            autoComplete="given-name"
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
                                            onChange={(e) => {setFirstName(e.target.value)}}
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            required
                                            autoComplete="family-name"
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
                                            onChange={(e) => {setPatronomicName(e.target.value)}}
                                            id="last-name"
                                            name="patronomic-name"
                                            type="text"
                                            autoComplete="patronomic-name"
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
                                            onChange={(e) => {setEmail(e.target.value)}}
                                            id="email"
                                            name="email"
                                            required
                                            type="email"
                                            autoComplete="email"
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
                                            onChange={(e) => {setPhone(e.target.value)}}
                                            id="phone"
                                            name="phone"
                                            required
                                            type="phone"
                                            autoComplete="phone"
                                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="snils" className="block text-sm font-medium leading-6 text-gray-900">
                                        СНИЛС*
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onChange={(e) => {setSnils(e.target.value)}}
                                            id="snils"
                                            required
                                            name="snils"
                                            type="snils"
                                            autoComplete="snils"
                                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                                        Дата рождения*
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            onChange={(e) => {setBirthDate(e.target.value)}}
                                            id="birthDate"
                                            required
                                            name="birthDate"
                                            type="date"
                                            autoComplete="birthDate"
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
                                            onChange={(e) => {setPassword(e.target.value)}}
                                            id="password"
                                            required
                                            name="password"
                                            type="password"
                                            autoComplete="password"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
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
        <Footer/>
        
    </>
  )
}

export default Registration