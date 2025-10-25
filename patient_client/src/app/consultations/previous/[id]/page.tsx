'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConsultationService from '@/services/consultations'
import { SlotWithRoomPatient } from '@/types/consultaion'
import dayjs from 'dayjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

const ConsultationPage = () => {
  const params = useParams() as { id?: string | string[] } | null
  const rawId = params?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const [consultation, setConsultation] = useState<SlotWithRoomPatient | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchConsultation()
  }, [id])

  const fetchConsultation = async () => {
    try {
      if (id) {
        const res = await ConsultationService.getConsultationById(parseInt(id))
        setConsultation(res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDownloadProtocol = async () => {
    if (!id) return
    try {
      setDownloading(true)
      const response = await ConsultationService.downloadProtocol(parseInt(id))

      // Получаем blob (Word файл)
      /* const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }) */
     const blob = new Blob([response.data], { type: 'application/pdf', })

      // Формируем имя файла
      const patientName: string = consultation?.Patient
        ? `${consultation.Patient?.secondName}_${consultation.Patient?.firstName}`
        : 'Protocol'
      const fileName = `Протокол ТМК от ${dayjs().format('DD.MM.YYYY')}_${patientName}.pdf`

      // Создаём ссылку для скачивания
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error('Ошибка при загрузке протокола:', err)
    } finally {
      setDownloading(false)
    }
  }

  if (!consultation) {
    return <div className="p-6">Загрузка...</div>
  }

  const child = consultation.Room?.Child

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8 mb-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Прошедшая консультация</h1>

        {/* ====== ОСНОВНАЯ ИНФОРМАЦИЯ ====== */}
        <div className="bg-white shadow rounded-lg p-6 space-y-3 border border-gray-100">
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Дата консультации:</span>{' '}
            {dayjs(consultation.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
          </p>

          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Пациент:</span>{' '}
            {consultation.Patient.secondName} {consultation.Patient.firstName}{' '}
            {consultation.Patient.patronomicName}
          </p>

          {/* ====== ИНФОРМАЦИЯ О РЕБЁНКЕ ====== */}
          {consultation.Room?.childId && child && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Информация о ребёнке
              </h3>
              <p className="text-gray-800 font-medium">
                {child.lastName} {child.firstName}{' '}
                {child.patronymicName ? child.patronymicName : ''}
              </p>
              <p className="text-gray-600">
                Дата рождения:{' '}
                <span className="font-medium">
                  {dayjs(child.birthDate).format('DD.MM.YYYY')}
                </span>
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Врач:</span>{' '}
              {consultation.Doctor.secondName} {consultation.Doctor.firstName}{' '}
              {consultation.Doctor.patronomicName}
            </p>

            {consultation.Doctor.Posts && consultation.Doctor.Posts?.length > 0 && (
              <p className="text-gray-500 mt-1">
                {consultation.Doctor.Posts.map((post, idx) => (
                  <span key={post.id}>
                    {post.postName}
                    {consultation.Doctor.Posts &&
                      idx < consultation.Doctor?.Posts?.length - 1 &&
                      ', '}
                  </span>
                ))}
              </p>
            )}

            {consultation.Doctor.MedOrg && (
              <p className="text-gray-500">{consultation.Doctor.MedOrg.medOrgName}</p>
            )}
          </div>
        </div>

        {/* ====== ПРОТОКОЛ ====== */}
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Протокол консультации</h2>

            {consultation.Room?.protocol && (
              <button
                onClick={handleDownloadProtocol}
                disabled={downloading}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition
                  ${
                    downloading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {downloading ? 'Формируется...' : 'Скачать протокол'}
              </button>
            )}
          </div>

          {consultation.Room?.protocol ? (
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {consultation.Room.protocol}
            </p>
          ) : (
            <p className="text-gray-500 italic">Протокол отсутствует</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ConsultationPage
