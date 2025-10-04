'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <h2 id="footer-heading" className="sr-only">Футер</h2>
      <div className="mx-auto max-w-7xl px-6 py-6 sm:py-20 lg:px-8">
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
              Надёжные консультации и поддержка. Мы всегда рядом.
            </p>
          </div>

          {/* Навигация */}
          <div className="mt-10 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Навигация</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultations/current" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Активные консультации
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultations/previous" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Завершённые консультации
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">О компании</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/pricing" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Цены
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link href="/payments" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
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
                    <Link href="/privacy" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Политика конфиденциальности
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                      Условия использования
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-16 border-t border-gray-100 pt-8 sm:mt-20">
          <p className="text-xs leading-5 text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Your Company. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
