'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import Link from 'next/link'
import Footer from './Footer'
import Loader from './Loader'

const Header = () => {
    const router = useRouter()
    const store = useStore()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    const openProfile = () => {
        setLoading(true)
        router.push('/profile')
    }

    const logout = () => {
        store.logout()
        location.reload()
    }

    const [loading, setLoading] = useState(false)

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
    else


    return (
        <header className="bg-white">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        {/* <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" /> */}
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">

                    <Link href="/" onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900">
                        Телемедицинские консультации
                    </Link>
                    <Link href="/secondOpinion" onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900">
                        Второе мнение
                    </Link>
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                            Консультации
                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                            <div className="p-4">
                                <div
                                    className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                >
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <LockOpenIcon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                    </div>
                                    <div className="flex-auto">
                                        <Link href='/consultations/current/' onClick={() => setLoading(true)} className="block font-semibold text-gray-900">
                                            Активные консультации
                                            <span className="absolute inset-0" />
                                        </Link>
                                        {/* <p className="mt-1 text-gray-600">Прошедшие консультации</p> */}
                                    </div>
                                </div>
                                <div
                                    className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                >
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <LockClosedIcon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                    </div>
                                    <div className="flex-auto">
                                        <Link href='/consultations/previous/' onClick={() => setLoading(true)} className="block font-semibold text-gray-900">
                                            Завершённые консультации
                                            <span className="absolute inset-0" />
                                        </Link>
                                        {/* <p className="mt-1 text-gray-600">Прошедшие консультации</p> */}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                {callsToAction.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                                >
                                    <item.icon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                    {item.name}
                                </Link>
                                ))}
                            </div> */}
                        </PopoverPanel>
                    </Popover>
                    <Link href="/pricing" onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900">
                        Цены
                    </Link>
                    <Link href="/contacts" onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900">
                        Контакты
                    </Link>
                    <Link href="/payments" onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900">
                        Платежи
                    </Link>
                </PopoverGroup> 
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    { store.isAuth === false ?
                        <Link href='/login' onClick={() => setLoading(true)} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                            Войти <span aria-hidden="true">&rarr;</span>
                        </Link>
                        :
                        <>
                            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                                <Popover className="relative">
                                    <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                        {store.user?.secondName} {store.user?.firstName}
                                        <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                    </PopoverButton>

                                    <PopoverPanel
                                        transition
                                        className="absolute -right-8 top-full z-10 mt-3 w-96 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                                        >
                                        
                                        <div className="relative rounded-lg p-4 hover:bg-gray-50">
                                            <button onClick={openProfile} className="block text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                                Профиль
                                                <span className="absolute inset-0" />
                                            </button>
                                            <p className="mt-1 text-sm leading-6 text-gray-600">Просмотреть свой профиль</p>
                                        </div>
                                        <div className="relative rounded-lg p-4 hover:bg-gray-50">
                                            <button onClick={logout} className="block text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                                Выйти
                                                <span className="absolute inset-0" />
                                            </button>
                                        </div>
                                        
                                    </PopoverPanel>
                                </Popover>
                            </PopoverGroup>                            
                        </>
                    }
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 flex w-full flex-col justify-between overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <Link href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                {/* <img
                                    alt=""
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                /> */}
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <Link
                                        href="/"
                                        onClick={() => setLoading(true)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Телемедицинские консультации
                                    </Link>
                                </div>
                                <div className="space-y-2 py-6">
                                    <Link
                                        href="/secondOpinion"
                                        onClick={() => setLoading(true)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Второе мнение
                                    </Link>
                                </div>
                                <div className="space-y-2 py-6">
                                    <Link
                                        href="/consultations/current"
                                        onClick={() => setLoading(true)}
                                        className="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <LockOpenIcon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                        </div>
                                        Активные консультации
                                    </Link>
                                    <Link
                                        href="/consultations/previous"
                                        onClick={() => setLoading(true)}
                                        className="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <LockClosedIcon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                        </div>
                                        Завершённые консультации
                                    </Link>
                                </div>

                                <div className="space-y-2 py-6">
                                    <Link
                                        href="/pricing"
                                        onClick={() => setLoading(true)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Цены
                                    </Link>
                                    <Link
                                        href="/contacts"
                                        onClick={() => setLoading(true)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Контакты
                                    </Link>
                                    <Link
                                        href="/payments"
                                        onClick={() => setLoading(true)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Платежи
                                    </Link>
                                </div>

                                { store.isAuth === false ?
                                    <div className="py-6">
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Войти
                                        </button>
                                    </div>
                                    :
                                    <div className="py-6">
                                        <button
                                            onClick={openProfile}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                                        >
                                            {store.user?.secondName} {store.user?.firstName}
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Выйти
                                        </button>
                                    </div>
                                    
                                }
                                
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
export default observer(Header)
