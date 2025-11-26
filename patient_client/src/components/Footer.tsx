'use client'

import Link from 'next/link'
import Header from './Header'
import Loader from './Loader'
import { useState } from 'react'

const Footer = () => {
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
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <h2 id="footer-heading" className="sr-only">Футер</h2>
      <div className="mx-auto max-w-7xl px-6 py-2 sm:py-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Логотип */}
          <div>
            {/* <Link href="/" className="flex items-center gap-x-2">
              <img
                alt="Логотип компании"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
              <span className="text-base font-semibold text-gray-900">Your Company</span>
            </Link> */}
            <p className="mt-4 text-sm text-gray-500">
              {/* Надёжные консультации и поддержка. Мы всегда рядом. */}
            </p>
          </div>

          {/* Навигация */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Навигация</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultations/current" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Активные консультации
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultations/previous" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Завершённые консультации
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">О компании</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/pricing" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Цены
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link href="/payments" onClick={() => setLoading(true)} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Платежи
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Правовая информация */}
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Правовая информация</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/Доктор_Рядом_Перечень_Обрабатываемых_Персональных_Данных.pdf`} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Политика обработки персональных данных
                    </Link>
                  </li>
                  <li>
                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_Положение_Информированное_Добровольное_Согласие_ТМК.pdf`} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Добровольное информированное согласие
                    </Link>
                  </li>
                  <li>
                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_ВнутреннийРаспорядокПотребителейМедицинскихУслуг.pdf`} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Внутренний распорядок потребителей медицинских услуг
                    </Link>
                  </li>
                  <li>
                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_Положение_ТМК.pdf`} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Положение об организации и оказания медицинской помощи
                    </Link>
                  </li>
                  <li>
                    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/license/ДокторРядом_ПорядокИУсловияПроведения_ТМК.pdf`} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Порядок и условия проведения ТМК
                    </Link>
                  </li>
                  
                  
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-6 border-t border-gray-100 pt-8 sm:mt-20">
          <p className="text-xs leading-5 text-gray-500 text-center">
            &copy; {new Date().getFullYear()} ООО &laquo;Клиникод&raquo;
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
