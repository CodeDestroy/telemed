'use client'
import Header from '@/components/Header'
import ConsultationService from '@/services/consultations'
import { useStore } from '@/store'
import { ConsultationFull } from '@/types/consultaion'
import dayjs from 'dayjs'
import { set } from 'mobx'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'

function page() {

    const router = useRouter()
    const store = useStore()

    const [consultations, setConsultations] = useState<ConsultationFull[]>([])

    const fetchConsultations = async () => {
        try {
            /* console.log(store.user?.id) */
            if (store.user?.id) {
                const response = await ConsultationService.getPreviousConsultations(store.user.id)
                const data: ConsultationFull[] = response.data
                console.log(data)
                setConsultations(data)
            }
            
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(store.isAuth)
        fetchConsultations()

    }, [])
    
    useEffect(() => {
        if (!store.isAuth) {
            router.push('/login')
        }
    }, [store])
    
    return (
        <>
            <Header/>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ваши консультации</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Просмотр прошедших консультаций
                    </p>
                    <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
                        {consultations.length > 0 && consultations.map((consultation) => (
                            <article
                                key={consultation.roomId}
                                className="flex max-w-full flex-col sm:flex-row items-start justify-between border-b border-gray-200 pb-4"
                                >
                                {/* Левая часть — инфа о консультации */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime={consultation.slotStartDateTime} className="text-gray-500">
                                            {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
                                        </time>
                                        <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                                            {consultation.ended ? 'Завершена' : ''}
                                        </span>
                                    </div>
                                    <div className="group relative col-span-4">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                            <a href={`/rooms/${consultation.roomId}`}>
                                            <span className="absolute inset-0" />
                                            {consultation.pSecondName} {consultation.pFirstName} {consultation.pPatronomicName}
                                            </a>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {consultation.protocol?.substring(0, 50)}...
                                        </p>
                                    </div>
                                    <div className="relative mt-2 flex items-center gap-x-4">
                                        <div className="text-sm leading-6">
                                            <p className="font-semibold text-gray-900">
                                            <a href={(consultation.doctorId)?.toString()}>
                                                <span className="absolute inset-0" />
                                                {consultation.dSecondName} {consultation.dFirstName} {consultation.dPatronomicName}
                                            </a>
                                            </p>
                                            <p className="text-gray-600">{consultation.postName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Правая часть — кнопка */}
                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 self-center">
                                    <a
                                        onClick={() => router.push(`previous/${(consultation.slotId)?.toString()}`)}
                                        /* href={`./${(consultation.slotId)?.toString()}`} */
                                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer"
                                    >
                                        Открыть консультацию 
                                    </a>
                                </div>
                            </article>

                        ))}
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page