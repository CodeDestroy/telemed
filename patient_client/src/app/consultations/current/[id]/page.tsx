'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
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
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const [consultation, setConsultation] = useState<SlotWithRoomPatient | null>(null)
  const [url, setUrl] = useState<Url | null>(null)
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useStore()

  const fetchConsultation = async () => {
    try {
      if (id) {
        const res = await ConsultationService.getConsultationById(parseInt(id))
        setConsultation(res.data)

        if (store.user?.personId) {
          const url = await ConsultationService.getConsultationUrl(res.data.id, store.user?.id)
          setUrl(url.data)
        }

        const filesRes = await ConsultationService.getFiles(parseInt(id))
        setFiles(filesRes.data || [])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    try {
      setUploading(true)
      await ConsultationService.uploadFile(parseInt(id), file, store.user?.personId)
      await fetchConsultation() // обновляем список файлов
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    fetchConsultation()
  }, [id, store.isAuth])

  if (!consultation) {
    return <div className="p-6">Загрузка...</div>
  }

  const canJoin =
    url && consultation
      ? dayjs().isAfter(dayjs(consultation.slotStartDateTime).subtract(30, 'minute'))
      : false

  const paymentStatus = consultation.Payment?.paymentStatusId

  return (
    <>
      <Header />
      <PageLoader />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-7">
        <h1 className="text-2xl font-bold mb-4">Консультация</h1>

        <div className="bg-white shadow rounded-lg p-6 flex gap-6 items-center">
          <img
            src={consultation.Doctor?.User?.avatar || '/default-avatar.png'}
            alt={`${consultation.Doctor?.secondName} ${consultation.Doctor?.firstName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {consultation.Doctor?.secondName} {consultation.Doctor?.firstName}{' '}
              {consultation.Doctor?.patronomicName}
            </h1>
            <p className="text-gray-600">{consultation.Doctor?.Post?.postName}</p>
            <p className="text-gray-500">{consultation.Doctor?.MedOrg?.medOrgName}</p>
            <p className="text-gray-500">
              Дата: {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
            </p>
          </div>
        </div>

        {/* ====== ФАЙЛЫ ====== */}
        {paymentStatus === 3 &&
            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold">Дополнительные файлы</h2>
                <p className="text-gray-500 mb-4">Прикрепите файлы, которые помогут врачу в подготовке к консультации</p>

                <div className="mb-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="border p-2 rounded"
                    />
                    {uploading && <p className="text-gray-500 mt-2">Загрузка файла...</p>}
                </div>

                {files.length > 0 ? (
                    <ul className="space-y-2">
                    {files.map((f) => (
                        <li key={f.id}>
                        <a
                            href={f.url.startsWith('http') ? f.url : `${process.env.NEXT_PUBLIC_SERVER_URL}${f.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {f.originalname || f.filename}
                        </a>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Нет прикреплённых файлов</p>
                )}
            </div>
        }

        <div className="my-6">
          {paymentStatus === 1 && (
            <a
              href={`/payments/${consultation.Payment?.uuid4}`}
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

          {paymentStatus === 3 && (
            <a
              className={`p-4 border rounded ${
                canJoin
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
              href={canJoin ? url?.originalUrl : undefined}
              onClick={(e) => !canJoin && e.preventDefault()}
            >
              Подключиться
            </a>
          )}

          {paymentStatus === 4 && (
            <p className="p-4 bg-blue-100 text-green-700 rounded">Консультация завершена</p>
          )}

          {paymentStatus === 5 && (
            <p className="p-4 bg-blue-100 text-red-500 rounded">Консультация отменена</p>
          )}

          {(paymentStatus === 3 || paymentStatus === 4) && !canJoin && (
            <p className="text-sm text-gray-500 mt-4">
              Возможность подключиться появится за 30 минут до начала
            </p>
          )}
        </div>

        
      </div>
      <Footer />
    </>
  )
}

export default Page
