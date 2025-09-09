import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/20/solid'
import Header from '@/components/Header'

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

export default function Example() {
    return (
        <>
            <Header/>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Наши цены</h2> */}
                        {<p className="mt-2 text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
                            Наши цены
                        </p>}
                    </div>
                    {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas in.
                        Explicabo id ut laborum.
                    </p> */}

                    {/* xs to lg */}
                    {/* <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
                        {tiers.map((tier) => (
                            <section
                                key={tier.id}
                                className={classNames(
                                    tier.mostPopular ? 'rounded-xl bg-gray-400/5 ring-1 ring-inset ring-gray-200' : '',
                                    'p-8',
                                )}
                            >
                            <h3 id={tier.id} className="text-sm font-semibold leading-6 text-gray-900">
                                {tier.name}
                            </h3>
                            <p className="mt-2 flex items-baseline gap-x-1 text-gray-900">
                                <span className="text-4xl font-bold">{tier.priceMonthly}</span>
                                <span className="text-sm font-semibold">/month</span>
                            </p>
                            <a
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={classNames(
                                tier.mostPopular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                                'mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                                )}
                            >
                                Buy plan
                            </a>
                            <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-900">
                                {sections.map((section) => (
                                <li key={section.name}>
                                    <ul role="list" className="space-y-4">
                                    {section.features.map((feature) =>
                                        feature.tiers[tier.name] ? (
                                        <li key={feature.name} className="flex gap-x-3">
                                            <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                                            <span>
                                            {feature.name}{' '}
                                            {typeof feature.tiers[tier.name] === 'string' ? (
                                                <span className="text-sm leading-6 text-gray-500">({feature.tiers[tier.name]})</span>
                                            ) : null}
                                            </span>
                                        </li>
                                        ) : null,
                                    )}
                                    </ul>
                                </li>
                                ))}
                            </ul>
                            </section>
                        ))}
                    </div> */}

                    {/* lg+ */}
                    <div className="isolate mt-20">
                        <div className="relative -mx-8">
                            {tiers.some((tier) => tier.mostPopular) ? (
                            <div className="absolute inset-x-4 inset-y-0 -z-10 flex">
                                <div
                                style={{ marginLeft: `${(tiers.findIndex((tier) => tier.mostPopular) + 1) * 25}%` }}
                                aria-hidden="true"
                                className="flex w-1/4 px-4"
                                >
                                <div className="w-full rounded-t-xl border-x border-t border-gray-900/10 bg-gray-400/5" />
                                </div>
                            </div>
                            ) : null}
                            <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                            <caption className="sr-only">Ценообразование</caption>
                            <colgroup>
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                            </colgroup>
                            <thead>
                                <tr>
                                <td />
                                {tiers.map((tier) => (
                                    <th key={tier.id} scope="col" className="px-6 pt-6 xl:px-8 xl:pt-8">
                                        <div className="text-center text-sm font-semibold leading-7 text-gray-900">{tier.name}</div>
                                    </th>
                                ))}
                                </tr>
                            </thead>
                            <tbody>
                                
                                {sections.map((section, sectionIdx) => (
                                <Fragment key={section.name}>
                                    {section.features.map((feature) => (
                                    <tr key={feature.name}>
                                        <th scope="row" className="py-4 text-sm font-normal leading-6 text-gray-900">
                                            {feature.name}
                                        <div className="absolute inset-x-8 mt-4 h-px bg-gray-900/5" />
                                        </th>
                                        {tiers.map((tier) => (
                                        <td key={tier.id} className="px-6 py-4 xl:px-8">
                                            {typeof feature.tiers[tier.name] === 'string' ? (
                                            <div className="text-center text-sm leading-6 text-gray-500">
                                                {feature.tiers[tier.name]}
                                            </div>
                                            ) : (
                                            <>
                                                {feature.tiers[tier.name] === true ? (
                                                <CheckIcon aria-hidden="true" className="mx-auto h-5 w-5 text-indigo-600" />
                                                ) : (
                                                <MinusIcon aria-hidden="true" className="mx-auto h-5 w-5 text-gray-400" />
                                                )}

                                                <span className="sr-only">
                                                {feature.tiers[tier.name] === true ? 'Included' : 'Not included'} in {tier.name}
                                                </span>
                                            </>
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
            </div>
        </>
    )
}
