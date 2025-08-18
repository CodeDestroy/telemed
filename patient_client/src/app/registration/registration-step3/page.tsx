'use client'
import Header from '@/components/Header'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { FormEvent, useEffect, useState } from 'react'

import { useStore } from '@/store'
import AuthService from '@/services/auth'
import { AxiosError } from 'axios'
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react-lite'
export default observer (function Registration() {

    const searchParams = useSearchParams()
    const store = useStore()
    const router = useRouter()
    const phone: string = searchParams.get("phone")

    // пробуем достать code из URL, если его нет — используем состояние
    const [code, setCode] = useState<string | number | readonly string[] >(searchParams.get("code") || "")
  

    const [errors, setErrors] = useState<string[]>([])


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            setErrors([])
            event.preventDefault()
            /* const response = await AuthService.confirmEmail(phone, code) */
            await store.registrationByCode(phone, code?.toString())
           
            
            
        }
        catch (e: any) {
            if (e.response?.data) {
                setErrors([e.response.data])
            } else {
                setErrors(["Неизвестная ошибка"])
            }
        }
    }

    useEffect(() => {
        if (store.isAuth) {
            router.push('/')
        }
        console.log(store)
    }, [store.isAuth, router])



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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errors && errors.length > 0 ?      
                            <div className="w-full"> 
                                <ul>
                                    {errors.map((err, i) => (
                                        <li className="text-red-800 block text-sm font-medium leading-6 text-gray-900" key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                            : 
                            ''
                        }
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Код подтверждения</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Введите код"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                            >
                            Подтвердить
                        </button>
                    </form>
                   {/*  <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            
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
                            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={registration}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Зарегистрироваться
                            </button>
                        </div>
                    </form> */}
                </div>
            </div>
        </div>
        
    </>
  )
})