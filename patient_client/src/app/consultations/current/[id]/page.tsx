'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConsultationService from '@/services/consultations'
import { SlotWithRoomPatient, Url } from '@/types/consultaion'
import dayjs from 'dayjs'
import Header from '@/components/Header'
import { useStore } from '@/store'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const Page = () => {
    const params = useParams() as { id?: string | string[] } | null
    const rawId = params?.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId // теперь id: string | undefined
    const [consultation, setConsultation] = useState<SlotWithRoomPatient | null>(null)
    const [url, setUrl] = useState<Url | null>(null)
    const store = useStore()

    const fetchConsultation = async () => {
        try {
            if (id) {
                const res = await ConsultationService.getConsultationById(parseInt(id))
                setConsultation(res.data)
                if (store.user?.personId){
                    const url = await ConsultationService.getConsultationUrl(res.data.id, store.user?.id)
                    setUrl(url.data)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    
    useEffect(() => {
        fetchConsultation()
    }, [id, fetchConsultation(), store.isAuth])
    
    if (!consultation) {
        return <div className="p-6">Загрузка...</div>
    }

    const canJoin = url && consultation 
    ? dayjs().isAfter(dayjs(consultation.slotStartDateTime).subtract(30, 'minute'))
    : false

    return (
        <>
            <Header/>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-7">
                <h1 className="text-2xl font-bold mb-4">
                    Консультация 
                </h1>
                <p className="text-gray-600">
                    Дата: {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
                </p>
                <p className="mt-4">
                    Пациент: {consultation.Patient.secondName} {consultation.Patient.firstName} {consultation.Patient.patronomicName}
                </p>
                <p className="mt-2">
                    Врач: {consultation.Doctor.secondName} {consultation.Doctor.firstName} {consultation.Doctor.patronomicName} — {consultation.Doctor.Post?.postName}
                </p>
                {url && (
                    <div className="mt-6">
                        <a
                            className={`mt-6 p-4 border rounded ${
                                canJoin ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            href={canJoin ? url.originalUrl : undefined}
                            onClick={(e) => !canJoin && e.preventDefault()}
                        >
                            Подключиться
                        </a>
                        {!canJoin && (
                            <p className="text-sm text-gray-500 mt-4">
                                Возможность подключиться появится за 30 минут до начала
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
        
    )
}

export default Page
