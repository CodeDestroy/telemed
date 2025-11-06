'use client'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Loader from '@/components/Loader'
import ConsultationService from '@/services/consultations'
import { useStore } from '@/store'
import { ConsultationFull, SlotWithRoomPatient } from '@/types/consultaion'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'

const Page = () => {

    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const store = useStore()

    const [consultations, setConsultations] = useState<SlotWithRoomPatient[]>([])

    const fetchConsultations = async () => {
        try {
            /* console.log(store.user?.id) */
            if (store.user?.id) {
                const response = await ConsultationService.getCurrentConsultations(store.user.id)
                const data: SlotWithRoomPatient[] = (response.data).sort((a, b) => {
                    return a.slotStartDateTime < b.slotStartDateTime ? 1 : -1
                })
                setConsultations(data)
            }
            
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchConsultations()

    }, [])
    
    useEffect(() => {
        if (!store.isAuth) {
            router.push('/login')
        }
    }, [store])

    
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
        <>
            <Header/>
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ваши консультации</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Просмотр активных консультаций
                    </p>
                    <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
                        {consultations.length > 0 && consultations.map((consultation) => (
                            <article
                                key={consultation.Room.id}
                                className="flex max-w-full flex-col sm:flex-row items-start justify-between border-b border-gray-200 pb-4"
                                >
                                {/* Левая часть — инфа о консультации */}
                                <div className="flex-1">
                                    <img
                                        //src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        src={consultation?.Doctor.User?.avatar}
                                        alt={`Фото`}
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime={consultation.slotStartDateTime} className="text-gray-500">
                                            {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
                                        </time>
                                        <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                                            {consultation.Room.ended ? 'Завершена' : ''}
                                        </span>
                                    </div>
                                    <div className="group relative col-span-4">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                            <a href={`/rooms/${consultation.Room.id}`}>
                                            <span className="absolute inset-0" />
                                                {consultation.Doctor.secondName} {consultation.Doctor.firstName} {consultation.Doctor.patronomicName}
                                            </a>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {consultation.Room.protocol?.substring(0, 50)}...
                                        </p>
                                    </div>
                                    <div className="relative mt-2 flex items-center gap-x-4">
                                        <div className="text-sm leading-6">
                                            <p className="font-semibold text-gray-900">
                                            <a href={(consultation.doctorId)?.toString()}>
                                                <span className="absolute inset-0" />
                                                {consultation.Patient.secondName} {consultation.Patient.firstName} {consultation.Patient.patronomicName}
                                            </a>
                                            </p>
                                            {
                                                consultation.Doctor.Posts && consultation.Doctor.Posts.length > 0 &&consultation.Doctor.Posts.map((post) => (
                                                    <p key={`${consultation.id}_${post.id}`} className="text-gray-600">{post.postName}</p>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Правая часть — кнопка */}
                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 self-center">
                                    <a
                                        onClick={() => {setLoading(true); router.push(`current/${(consultation.id)?.toString()}`)}}
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
            <Footer/>
        </>
    )
}

export default Page