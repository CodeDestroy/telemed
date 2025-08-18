'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";

import DoctorListItemResponse from '@/types/main'
import main from "@/services/main";
import Header from "@/components/Header";
import { store } from "@/store";

interface Consultation {
  id: number;
  slotStartDateTime: string;
  slotEndDateTime: string;
  slotStatusId: number;
}

export default function DoctorPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [doctor, setDoctor] = useState<DoctorListItemResponse>();
  const [doctorIsLoading, setDoctorIsLoading] = useState(true);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [activeConsultations, setActiveConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await main.getDoctor(parseInt(id), new Date());
      setDoctor(response.data);
      setDoctorIsLoading(false);
    } catch (error) {
      console.log(error);
      setDoctorIsLoading(false);
    }
  };

  const fetchDoctorSchedule = async (date: string) => {
    try {
      if (!id) return;
      const response = await main.getDoctorSchedule(parseInt(id), new Date(date));
      const schedule = response.data; // [{scheduleStartTime, scheduleEndTime}, ...]
      
      // Загружаем занятые консультации
      const consultationsResponse = await main.getDoctorConsultations(parseInt(id), new Date(date));
      setActiveConsultations(consultationsResponse.data);

      // Генерация доступных временных интервалов
      const slots: string[] = [];
      schedule.forEach((slot: any) => {
        let start = dayjs(`${date}T${slot.scheduleStartTime}`);
        const end = dayjs(`${date}T${slot.scheduleEndTime}`);

        while (start.isBefore(end)) {
          const formatted = start.format("HH:mm");
          const isUnavailable = consultationsResponse.data.some((c: Consultation) => {
            const cStart = dayjs(c.slotStartDateTime);
            return start.isSame(cStart, "minute") && c.slotStatusId !== 5; // 5 = отменено
          });
          if (!isUnavailable) {
            slots.push(formatted);
          }
          start = start.add(60, "minute"); // шаг 30 минут
        }
      });
      setAvailableTimes(slots);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    fetchDoctorSchedule(date);
  };

    const handleBooking = async () => {
        if (!doctor || !selectedDate || !selectedTime) return;

        try {
            if (store.user?.id) {
                const startDateTime = dayjs(`${selectedDate}T${selectedTime}`).toISOString();
                const response = await main.createConsultation(
                    doctor.doctor.id,
                    store.user?.personId,
                    startDateTime,
                    60, // или другое значение
                );

                if (response.status === 200) {
                    alert("Вы успешно записаны!");
                } else {
                    alert("Не удалось записаться, попробуйте позже");
                }
            }
            else {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка при записи");
        }
    };

    if (doctorIsLoading && !doctor) {
        return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-6 text-center">
            <p className="text-gray-500">Загрузка информации...</p>
            </div>
        </>
        );
    }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Назад */}
        <a
          href="/"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Назад
        </a>

        {/* Информация о враче */}
        <div className="bg-white shadow rounded-lg p-6 flex gap-6 items-center">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt={`${doctor?.doctor.secondName} ${doctor?.doctor.firstName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {doctor?.doctor.secondName} {doctor?.doctor.firstName} {doctor?.doctor.patronomicName}
            </h1>
            <p className="text-gray-600">{doctor?.doctor.Post?.postName}</p>
          </div>
        </div>

        {/* Форма записи */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Записаться на прием</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите время</option>
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option disabled>Нет доступного времени</option>
                )}
              </select>
            </div>
          )}

          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={!selectedDate || !selectedTime}
          >
            Записаться
          </button>
        </div>
      </div>
    </>
  );
}
