'use client'

import Footer from "@/components/Footer"
import Header from "@/components/Header"

const Contacts = () => {
  return (
          <>
              <Header/>
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Контакты</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Наименование</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>Общество с ограниченной ответственностью</p>
                                    <p>«Доктор рядом»</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">ИНН</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>3662217650</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">КПП</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>366201001</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">ОГРН</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>1153668061117</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Юридический адрес</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>394066, РОССИЯ, ВОРОНЕЖСКАЯ ОБЛ., ГОРОД ВОРОНЕЖ Г.О., ВОРОНЕЖ Г., МОСКОВСКИЙ ПР-КТ, Д. 207, КВ. 132</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Фактический адрес</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>394050, Воронежская обл, Воронеж г, ул. Фёдора Тютчева, 93/5</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Директор</h3>
                                    <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                                    <p>Назарова Олеся Алексеевна</p>
                                    </address>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">Email</h3>
                                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                    <div>
                                        <dt className="sr-only">Email</dt>
                                        <dd>
                                        <a href="mailto:zr36a@yandex.ru" className="font-semibold text-indigo-600">
                                            zr36a@yandex.ru
                                        </a>
                                        </dd>
                                    </div>
                                    
                                    </dl>
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
export default Contacts