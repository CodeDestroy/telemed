'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConsultationService from '@/services/consultations'
import { SlotWithRoomPatient } from '@/types/consultaion'
import dayjs from 'dayjs'
import Header from '@/components/Header'

export default function ConsultationPage() {
    const params = useParams() as { id?: string | string[] } | null
    const rawId = params?.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId // теперь id: string | undefined
    const [consultation, setConsultation] = useState<SlotWithRoomPatient | null>(null)

    useEffect(() => {
        fetchConsultation()
    }, [id])

    const fetchConsultation = async () => {
        try {
            if (id) {
                const res = await ConsultationService.getConsultationById(parseInt(id))
                console.log(res)
                setConsultation(res.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    if (!consultation) {
        return <div className="p-6">Загрузка...</div>
    }

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
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="font-semibold mb-2">Протокол</h2>
                    <p>{consultation.Room.protocol}</p>
                </div>
            </div>
        </>
        
    )
}
