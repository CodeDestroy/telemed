'use client'


import Header from '@/components/Header'

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { User } from '@/types/user'
import dayjs from 'dayjs'
import AuthService from '@/services/auth'
import { observer } from 'mobx-react-lite'
import { AxiosError } from '@/types/errors'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ChildrenSection from '@/components/ChildrenSection'
import { IMaskInput } from 'react-imask'
const Page = () => {
    const store = useStore()
    const [user, setUser] = useState<User | null>(store.user)
    const [formattedPhone, setFormattedPhone] = useState(store.user?.phone) // для отображения
    const [errors, setErrors] = useState<string[]>([])
    const phoneRef = useRef<HTMLInputElement>(null)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUser(prev => prev ? { ...prev, [name]: value } : prev)
    }

    const setPhone = (phone: string) => {
        setUser(prev => prev ? { ...prev, phone: phone } : prev)
    }
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!store.isLoading && !store.user && !store.isAuth) {
            window.location.href = '/login'
        }
    }, [store])

    const chechFormData = () => {
        let currErrorIndicator = false
        const currError: string[] = []
        if (!user?.secondName || user?.secondName.length < 2) {
            
            currError.push('Введите Фамилию')
            currErrorIndicator = true
        }
        if (!user?.firstName|| user?.firstName.length < 2) {
            currError.push('Введите Имя')
            currErrorIndicator = true
        }
        if (!user?.phone || user?.phone.length < 11 || user?.phone.length > 13){
            currError.push('Введите Телефон')
            currErrorIndicator = true
        }
        if (!user?.email ) {
            currError.push('Введите Email')
            currErrorIndicator = true
        }
        if (user?.email && user?.email.length < 2) {
            currError.push('Email должен быть длиннее 2 символов')
            currErrorIndicator = true
        }
        if (!user?.snils || user?.snils.length != 11) {
            currError.push('Введите корректный СНИЛС')
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

    const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            if (user) {
            const response = await AuthService.updateUser(user)
            console.log(response)
            }
        } catch (e: unknown) {
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


    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <>
            <Header/>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                <div className="space-y-10 divide-y divide-gray-900/10">
                    {/* <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                        <div className="px-4 sm:px-0">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Профиль</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Здесь расположена информация о Вас
                            </p>
                        </div>

                        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div className="px-4 py-6 sm:p-8">
                                <div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="col-span-full">
                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                            О себе
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                id="about"
                                                name="about"
                                                rows={3}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                defaultValue={user?.info}
                                            />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-gray-600">Напишите краткую информацию о себе</p>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                            Фото
                                        </label>
                                        <div className="mt-2 flex items-center gap-x-3">
                                            <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-gray-300" />
                                            <button
                                                type="button"
                                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Изменить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div> */}

                    <div className="grid grid-cols-1 gap-y-8 pt-10 md:grid-cols-3 md:gap-x-8">
                        <div className="px-4 md:px-0">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Персональная информация</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Ваши персональные данные</p>
                        </div>

                        <form
                            onSubmit={handleSaveUser}
                            className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2"
                        >
                            <div className="px-4 py-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                                <div>
                                <label htmlFor="secondName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Фамилия
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="secondName"
                                    name="secondName"
                                    type="text"
                                    value={user?.secondName}
                                    onChange={handleChange}
                                    autoComplete="secondName"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div>
                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Имя
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={user?.firstName}
                                    onChange={handleChange}
                                    autoComplete="firstName"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div>
                                <label htmlFor="patronomicName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Отчество
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="patronomicName"
                                    name="patronomicName"
                                    value={user?.patronomicName}
                                    onChange={handleChange}
                                    type="text"
                                    disabled
                                    autoComplete="patronomicName"
                                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    Дата рождения
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="birthDate"
                                    name="birthDate"
                                    value={dayjs(user?.birthDate).format('DD.MM.YYYY')}
                                    onChange={handleChange}
                                    type="text"
                                    disabled
                                    autoComplete="birthDate"
                                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="email"
                                    value={user?.email}
                                    onChange={handleChange}
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                                </div>

                                <div>
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Телефон
                                </label>
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
                                        /* onChange={handleChange} */
                                        // обычные пропсы input
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+7 (___) ___-__-__"
                                    />
                                )}
                                {/* <div className="mt-2">
                                    <input
                                    id="phone"
                                    name="phone"
                                    value={user?.phone}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="phone"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div> */}
                                </div>

                                <div>
                                <label htmlFor="snils" className="block text-sm font-medium leading-6 text-gray-900">
                                    СНИЛС
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="snils"
                                    value={user?.snils}
                                    onChange={handleChange}
                                    name="snils"
                                    type="text"
                                    autoComplete="snils"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Сохранить
                            </button>
                            </div>
                        </form>
                    </div>


                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                        <div className="px-4 sm:px-0">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Уведомления</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Выберите способ уведомлений
                            </p>
                        </div>

                        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div className="px-4 py-6 sm:p-8">
                                <div className="max-w-2xl space-y-10">
                                    <fieldset>
                                        <legend className="text-sm font-semibold leading-6 text-gray-900">Телемедицинские консультации</legend>
                                        <div className="mt-6 space-y-6">
                                            <div className="relative flex gap-x-3">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                        checked
                                                        id="byEmail"
                                                        name="byEmail"
                                                        type="checkbox"
                                                        readOnly
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                </div>
                                                <div className="text-sm leading-6">
                                                    <label htmlFor="byEmail" className="font-medium text-gray-900">
                                                        По почте
                                                    </label>
                                                    <p className="text-gray-500">Получать уведомления о предстоящих консультациях по почте</p>
                                                </div>
                                            </div>
                                            <div className="relative flex gap-x-3">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                        disabled
                                                        id="bySms"
                                                        name="bySms"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                </div>
                                                <div className="text-sm leading-6">
                                                    <label htmlFor="bySms" className="font-medium text-gray-900">
                                                        С помощью СМС
                                                    </label>
                                                    <p className="text-gray-500">Получать уведомления о предстоящих консультациях по СМС</p>
                                                </div>
                                            </div>
                                            <div className="relative flex gap-x-3">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                        disabled
                                                        id="bySite"
                                                        name="bySite"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    />
                                                </div>
                                                <div className="text-sm leading-6">
                                                    <label htmlFor="bySite" className="font-medium text-gray-900">
                                                        На сайте
                                                    </label>
                                                    <p className="text-gray-500">Получать уведомления о предстоящих консультациях на сайте</p>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    {/* <fieldset>
                                        <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            These are delivered via SMS to your mobile phone.
                                        </p>
                                        <div className="mt-6 space-y-6">
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-everything"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                                <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Everything
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-email"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                                <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Same as email
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-nothing"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                                <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                                    No push notifications
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset> */}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ✅ Блок детей */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                        <div className="px-4 sm:px-0">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Дети</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Добавьте информацию о своих детях
                            </p>
                        </div>

                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div className="px-4 py-6 sm:p-8">
                                <ChildrenSection />
                            </div>
                    </div>
                    </div>

                    {/* ✅ Блок согласий */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                        <div className="px-4 sm:px-0">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Согласия</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                            Подтверждения, данные при регистрации
                            </p>
                        </div>

                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div className="px-4 py-6 sm:p-8">
                                <div className="space-y-6">
                                    {/* ✅ Согласие на обработку персональных данных */}
                                    <div className="flex items-start gap-x-3">
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                            readOnly
                                            className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <div className="text-sm leading-6 text-gray-700">
                                            <p>
                                            Согласен(а) с{' '}
                                            <Link
                                                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/Доктор_Рядом_Перечень_Обрабатываемых_Персональных_Данных.pdf`}
                                                target="_blank"
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                правилами обработки персональных данных
                                            </Link>
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                            Дата согласия: {dayjs(user?.createdAt).format('DD.MM.YYYY')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ✅ Согласие с информированным согласием */}
                                    <div className="flex items-start gap-x-3">
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                            readOnly
                                            className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <div className="text-sm leading-6 text-gray-700">
                                            <p>
                                            Принимаю{' '}
                                            <Link
                                                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_Положение_Информированное_Добровольное_Согласие_ТМК.pdf`}
                                                target="_blank"
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                условия информированного согласия
                                            </Link>
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                            Дата согласия: {dayjs(user?.createdAt).format('DD.MM.YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default observer(Page)
