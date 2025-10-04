'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConsultationService from '@/services/consultations'
import { SlotWithRoomPatient, Url } from '@/types/consultaion'
import dayjs from 'dayjs'
import Header from '@/components/Header'
import { useStore } from '@/store'
import duration from 'dayjs/plugin/duration'
import Footer from '@/components/Footer'
import PageLoader from '@/components/PageLoader'
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
    }, [id, store.isAuth])
    
    if (!consultation) {
        return <div className="p-6">Загрузка...</div>
    }

    const canJoin = url && consultation 
    ? dayjs().isAfter(dayjs(consultation.slotStartDateTime).subtract(30, 'minute'))
    : false

    const paymentStatus = consultation.Payment?.paymentStatusId

    return (
        <>
            <Header/>
            <PageLoader/>
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
                <div className="mt-6">
                    {paymentStatus === 1 && (
                        <a
                            href={`/payments/${consultation.Payment?.uuid4}`} // сюда подставляешь свою ссылку на оплату
                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                            Оплатить
                        </a>
                    )}

                    {paymentStatus === 2 && (
                        <p className="p-4 bg-blue-100 text-blue-700 rounded">
                            Платёж находится в обработке
                        </p>
                    )}

                    {(paymentStatus === 3) && (
                        <a
                            className={`p-4 border rounded ${
                                canJoin ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-200'
                            }`}
                            href={canJoin ? url?.originalUrl : undefined}
                            onClick={(e) => !canJoin && e.preventDefault()}
                        >
                            Подключиться
                        </a>
                    )}
                    {paymentStatus === 4 && (
                        <p className="p-4 bg-blue-100 text-green-700 rounded">
                            Консультация завершена
                        </p>
                    )}
                    {paymentStatus === 5 && (
                        <p className="p-4 bg-blue-100 text-red-500 rounded">
                            Консультация отменена
                        </p>
                    )}

                    {/* Для статусов 3 и 4 показываем сообщение про 30 минут */}
                    {(paymentStatus === 3 || paymentStatus === 4) && !canJoin && (
                        <p className="text-sm text-gray-500 mt-4">
                            Возможность подключиться появится за 30 минут до начала
                        </p>
                    )}
                </div>
            </div>
            <Footer/>
        </>
        
    )
}

export default Page
