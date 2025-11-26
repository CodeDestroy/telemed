import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/20/solid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface tierInterface {
    name: TierName,
    id: string,
    href: string,
    priceMonthly: string,
    description: string,
    mostPopular: boolean
}
type TierName = 'ТМК' | 'Цена'

interface featuresInterface {
    name: string,
    tiers: Record<TierName, boolean | string | null | undefined>
}

/* interface featuresInterface {
    name: string,
    tiers: {
        ТМК: boolean | null | undefined,
        Цена: string
    }
} */

interface sectionsInterface {
    name: string,
    features: featuresInterface[]
}

const tiers: tierInterface[] = [
  {
    name: 'ТМК',
    id: 'tier-essential',
    href: '#',
    priceMonthly: '$29',
    description: 'Quis eleifend a tincidunt pellentesque. A tempor in sed.',
    mostPopular: true,
  },
  {
    name: 'Цена',
    id: 'tier-Цена',
    href: '#',
    priceMonthly: '$59',
    description: 'Orci volutpat ut sed sed neque, dui eget. Quis tristique non.',
    mostPopular: false,
  },
]

const sections: sectionsInterface[] = [
  {
    name: 'Кардиолог',
    features: [
      { name: 'Консультация детского кардиолога первичная', tiers: { ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского кардиолога повторная', tiers: {  ТМК: true, Цена: '1400 ₽' } },
    ],
  },
  {
    name: 'Логопедия',
    features: [
      { name: 'Консультация заиколога', tiers: { ТМК: true, Цена: '1600 ₽' } },
      { name: 'Консультация нейропсихолога первичная', tiers: {  ТМК: true, Цена: '2600 ₽' } },
      { name: 'Importing and exporting', tiers: { ТМК: true, Цена: '1500 ₽' } },
    ],
  },
  {
    name: 'Гастроэнтерология',
    features: [
      { name: 'Консультация взрослого гастроэнтеролога первичная', tiers: { ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация взрослого гастроэнтеролога повторная', tiers: { ТМК: true, Цена: '1200 ₽' } },
      { name: 'Консультация детского гастроэнтеролога первичная', tiers: { ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского гастроэнтеролога повторная', tiers: { ТМК: true, Цена: '1200 ₽' } },
    ],
  },
  {
    name: 'Психология',
    features: [
      { name: 'Консультация психолога первичная', tiers: {  ТМК: true, Цена: '1800 ₽' } },
      { name: 'Консультация психолога повторная', tiers: {  ТМК: false, Цена: '1300 ₽' } },
    ],
  },
  {
    name: 'Неврология',
    features: [
      { name: 'Консультация детского невролога первичная', tiers: {  ТМК: false, Цена: '2000 ₽' } },
    ],
  },
  {
    name: 'Общей практики',
    features: [
      { name: 'Консультация врача общей практики (семейного врача) первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация врача общей практики (семейного врача) повторная', tiers: {  ТМК: true, Цена: '1200 ₽' } },
      { name: 'Консультация педиатра первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация педиатра повторная', tiers: {  ТМК: true, Цена: '1200 ₽' } },
    ],
  },
  {
    name: 'Урология',
    features: [
      { name: 'Консультация детского уролога первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского уролога повторная', tiers: {  ТМК: true, Цена: '1200 ₽' } },
    ],
  },
  {
    name: 'Хирургия',
    features: [
      { name: 'Консультация детского хирурга первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского хирурга повторная', tiers: {  ТМК: true, Цена: '1200 ₽' } },
    ],
  },
  {
    name: 'Ортопедия',
    features: [
      { name: 'Консультация ортопеда первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация ортопеда повторная', tiers: {  ТМК: true, Цена: '1200 ₽' } },
    ],
  },
  {
    name: 'Кожвен',
    features: [
      { name: 'Консультация дерматовенеролога первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация дерматовенеролога повторная', tiers: {  ТМК: true, Цена: '1300 ₽' } },
      { name: 'Консультация дерматолога первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского дерматолога первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация детского дерматолога повторная', tiers: {  ТМК: true, Цена: '1300 ₽' } },
      { name: 'Консультация криохирурга первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
    ],
  },
  {
    name: 'Оториноларингология',
    features: [
      { name: 'Консультация оториноларинголога первичная', tiers: {  ТМК: false, Цена: '1800 ₽' } },
      { name: 'Консультация оториноларинголога повторная', tiers: {  ТМК: true, Цена: '1300 ₽' } },
    ],
  },
  {
    name: 'Гинекология',
    features: [
      { name: 'Забор биоматериала', tiers: {  ТМК: false, Цена: '350 ₽' } },
      { name: 'Консультация гинеколога первичная', tiers: {  ТМК: false, Цена: '2000 ₽' } },
      { name: 'Консультация гинеколога повторная', tiers: {  ТМК: true, Цена: '1300 ₽' } },
      { name: 'Консультация детского гинеколога первичная', tiers: {  ТМК: false, Цена: '2000 ₽' } },
      { name: 'Консультация детского гинеколога повторная', tiers: {  ТМК: true, Цена: '1300 ₽' } },
    ],
  },
]



export default function PricingPage() {
  return (
    <>
      <Header />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
              Наши цены
            </p>
          </div>

          <div className="mt-20 overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
              <caption className="sr-only">Ценообразование</caption>
              <colgroup>
                <col className="w-1/2" />
                {tiers.map(() => <col key={Math.random()} className="w-1/4" />)}
              </colgroup>
              <thead>
                <tr>
                  <th />
                  {tiers.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className={`px-6 pt-6 xl:px-8 xl:pt-8 text-center text-sm font-semibold leading-7 text-gray-900 ${
                        tier.mostPopular ? 'bg-purple-100 rounded-t-xl' : ''
                      }`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <Fragment key={section.name}>
                    {section.features.map((feature) => (
                      <tr key={feature.name}>
                        <th
                          scope="row"
                          className="py-4 text-sm font-normal leading-6 text-gray-900"
                        >
                          {feature.name}
                        </th>
                        {tiers.map((tier) => (
                          <td
                            key={tier.id}
                            className={`px-6 py-4 xl:px-8 text-center ${
                              tier.mostPopular ? 'bg-purple-100' : ''
                            }`}
                          >
                            {typeof feature.tiers[tier.name] === 'string' ? (
                              <span className="text-sm leading-6 text-gray-500">
                                {feature.tiers[tier.name]}
                              </span>
                            ) : feature.tiers[tier.name] === true ? (
                              <CheckIcon
                                aria-hidden="true"
                                className="mx-auto h-5 w-5 text-indigo-600"
                              />
                            ) : (
                              <MinusIcon
                                aria-hidden="true"
                                className="mx-auto h-5 w-5 text-gray-400"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
