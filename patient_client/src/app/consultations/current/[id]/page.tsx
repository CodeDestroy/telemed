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
import Loader from '@/components/Loader'
import { File } from '@/types/file'
dayjs.extend(duration)

const Page = () => {
  const [loading, setLoading] = useState(false)
  const params = useParams() as { id?: string | string[] } | null
  const rawId = params?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const [consultation, setConsultation] = useState<SlotWithRoomPatient | null>(null)
  const [url, setUrl] = useState<Url | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useStore()

  const fetchConsultation = async () => {
    try {
      if (id) {
        const res = await ConsultationService.getConsultationById(parseInt(id))
        if (res.data.Room.ended)
          window.location.href = `/consultations/previous/${res.data.id}`
        console.log(res.data)
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

  if (!consultation) {
    return <div className="p-6">Загрузка...</div>
  }

  const canJoin =
    url && consultation
      ? dayjs().isAfter(dayjs(consultation.slotStartDateTime).subtract(30, 'minute'))
      : false

  const paymentStatus = consultation.Payment?.paymentStatusId
  const child = consultation.Room?.Child // предполагаем, что Room.Child загружается с API

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-7">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Консультация</h1>

        {/* ====== ДОКТОР ====== */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={consultation.Doctor?.User?.avatar || '/default-avatar.png'}
            alt={`${consultation.Doctor?.secondName} ${consultation.Doctor?.firstName}`}
            className="w-24 h-24 rounded-full object-cover shadow"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-gray-900">
              {consultation.Doctor?.secondName} {consultation.Doctor?.firstName}{' '}
              {consultation.Doctor?.patronomicName}
            </h2>

            {consultation.Doctor?.Posts && consultation.Doctor?.Posts?.length > 0 &&
              consultation.Doctor.Posts.map((post) => (
                <p key={post.id} className="text-gray-600">
                  {post.postName}
                </p>
              ))}

            <p className="text-gray-500">{consultation.Doctor?.MedOrg?.medOrgName}</p>
            <p className="text-gray-500">
              Дата консультации:{' '}
              <span className="font-medium">
                {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
              </span>
            </p>
          </div>
        </div>

        {/* ====== РЕБЁНОК ====== */}
        {consultation.Room?.childId && child && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Информация о ребёнке</h3>
            <p className="text-gray-800 font-medium">
              {child.lastName} {child.firstName}{' '}
              {child.patronymicName ? child.patronymicName : ''}
            </p>
            <p className="text-gray-600">
              Дата рождения:{' '}
              <span className="font-medium">{dayjs(child.birthDate).format('DD.MM.YYYY')}</span>
            </p>
          </div>
        )}

        {/* ====== ФАЙЛЫ ====== */}
        {paymentStatus === 3 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Дополнительные файлы</h2>
            <p className="text-gray-500 mb-4">
              Прикрепите файлы, которые помогут врачу в подготовке к консультации
            </p>

            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading}
                className="border p-2 rounded w-full sm:w-auto"
              />
              {uploading && <p className="text-gray-500 mt-2">Загрузка файла...</p>}
            </div>

            {files.length > 0 ? (
              <ul className="space-y-2">
                {files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={
                        f.url.startsWith('http')
                          ? f.url
                          : `${process.env.NEXT_PUBLIC_SERVER_URL}${f.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline break-all"
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
        )}

        {/* ====== УПРАВЛЕНИЕ ====== */}
        <div className="my-6">
          {paymentStatus === 1 && (
            <a
              href={`/payments/${consultation.Payment?.uuid4}`}
              onClick={() => setLoading(true)}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded inline-block"
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
              className={`p-4 border rounded inline-block transition-colors ${
                canJoin
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
              href={canJoin ? url?.originalUrl : undefined}
              onClick={(e) => !canJoin && e.preventDefault()}
            >
              Подключиться к консультации
            </a>
          )}

          {paymentStatus === 4 && (
            <p className="p-4 bg-green-50 text-green-700 rounded">
              Консультация завершена
            </p>
          )}

          {paymentStatus === 5 && (
            <p className="p-4 bg-red-50 text-red-600 rounded">
              Консультация отменена
            </p>
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
