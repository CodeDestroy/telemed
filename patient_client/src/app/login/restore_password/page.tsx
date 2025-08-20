'use client'

import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { AxiosError, AxiosErrorExtended } from '@/types/errors'

const ForgotPassword = () => {
    const store = useStore()
    const router = useRouter()

    const [step, setStep] = useState<1 | 2>(1) // шаг 1 — телефон, шаг 2 — код и новый пароль
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors([])
        try {
        // например, store.sendRecoveryCode(phone)
            const response = await store.sendRecoveryCode(phone)
            setStep(2)
        } catch (e: unknown) {
            console.log(e)
            const err = e as AxiosErrorExtended
            if (err.response?.data?.error) {
                setErrors([err.response.data.error])
            } else if (e instanceof Error) {
                setErrors([e.message])
            } else {
                setErrors(['Неизвестная ошибка'])
            }
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors([])
        try {
        // например, store.resetPassword(phone, code, newPassword)
            await store.resetPassword(phone, code, newPassword)
            router.push('/login')
        } catch (e: unknown) {
            const err = e as AxiosErrorExtended
            if (err.response?.data?.error) {
                setErrors([err.response.data.error])
            } else if (e instanceof Error) {
                setErrors([e.message])
            } else {
                setErrors(['Неизвестная ошибка'])
            }
        }
    }

  return (
    <div className="flex min-h-screen flex-col">
        {/* фиксированный верх */}
        <Header />

        {/* блок с формой центрируется в оставшейся высоте */}
        <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                    Восстановление пароля
                </h2>

                {errors.length > 0 && (
                    <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                        {errors.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="mt-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Отправить код
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleChangePassword} className="mt-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Код из SMS
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Новый пароль
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Сменить пароль
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  )
}

export default observer(ForgotPassword)
