'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import dayjs, { Dayjs } from "dayjs";

import DoctorListItemResponse from '@/types/main'
import main from "@/services/main";
import Header from "@/components/Header";
import { store } from "@/store";
import { ScheduleSlot } from "@/types/consultaion";
import Link from "next/link";

import { TextField, MenuItem, Button } from "@mui/material";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

import "dayjs/locale/ru";
import { Child } from "@/types/child";
import UserService from "@/services/user";

dayjs.locale("ru");
interface Consultation {
    id: number;
    slotStartDateTime: string;
    slotEndDateTime: string;
    slotStatusId: number;
}

const DoctorPage = () => {
    const params = useParams()
    const rawId = params?.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [doctor, setDoctor] = useState<DoctorListItemResponse>();
    const [doctorIsLoading, setDoctorIsLoading] = useState(true);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [activeConsultations, setActiveConsultations] = useState<Consultation[]>([]);

    const [selectedChild, setSelectedChild] = useState<number | "">("");
    const [children, setChildren] = useState<Child[]>([]);
    const user = store.user;
    const [showChildSelect, setShowChildSelect] = useState(false);


    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (id) {
            fetchDoctor();
        }
        if (user?.personId) {
            UserService.getChildren(user.personId)
            .then(res => setChildren(res.data || []))
            .catch(err => console.error("Ошибка загрузки детей", err));
        }
    }, [id]);

  const fetchDoctor = async () => {
    try {
      if (id) {
        const response = await main.getDoctor(parseInt(id), new Date());
        setDoctor(response.data);
        setDoctorIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setDoctorIsLoading(false);
    }
  };

  const fetchDoctorSchedule = async (date: string) => {
    try {
      if (!id) return;

      // Получаем расписание
      const response = await main.getDoctorSchedule(parseInt(id), new Date(date));
      const schedule = response.data;

      // Получаем уже занятые консультации
      const consultationsResponse = await main.getDoctorConsultations(parseInt(id), new Date(date));
      setActiveConsultations(consultationsResponse.data[0]);

      const slots: string[] = [];

      schedule.forEach((slot: ScheduleSlot) => {
        let start = dayjs(`${date}T${slot.scheduleStartTime}`);
        const end = dayjs(`${date}T${slot.scheduleEndTime}`);
        const now = dayjs(); // текущее время
        const plusTwoHours = now.add(2, 'h')

        while (start.isBefore(end)) {
          const formatted = start.format("HH:mm");

          // Проверяем, есть ли консультация на этот слот
          const isUnavailable = consultationsResponse.data[0].some((c: Consultation) => 
            dayjs(c.slotStartDateTime).isSame(start, "minute") && c.slotStatusId !== 5
          );

          if (!isUnavailable && start.isAfter(plusTwoHours)) {
            slots.push(formatted);
          }

          //Тут можно не фиксированоое время, а разбивку из таблицы schedule в БД
          start = start.add(60, "minute"); // шаг 60 минут
        }
      });

      setAvailableTimes(slots);

    } catch (e) {
      console.log(e);
    }
  };


  /* const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      fetchDoctorSchedule(date.format("YYYY-MM-DD"));
    }
  }; */
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      fetchDoctorSchedule(date.format("YYYY-MM-DD"));
    } else {
      setAvailableTimes([]);
    }
  };


  const [price, setPrice] = useState<number | string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);


  const handleSelectTime = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    setSelectedTime(time);
    if (!doctor || !selectedDate) return;

    try {
      setLoadingPrice(true);
      const startDateTime = dayjs(`${selectedDate.format("YYYY-MM-DD")}T${time}`).toISOString();

      // запрос цены к бэку
      const response = await main.getConsultationPrice(doctor.doctor.id, startDateTime);

      setPrice(response.data.price); // например, { price: 2500 }
    } catch (e) {
      console.error("Ошибка получения цены", e);
      setPrice(null);
    } finally {
      setLoadingPrice(false);
    }

  };

  const handleBooking = async () => {
    if (!doctor || !selectedDate || !selectedTime) return;
    try {
      if (store.user?.id) {
        const startDateTime = dayjs(`${selectedDate.format("YYYY-MM-DD")}T${selectedTime}`).toISOString();
        setLoading(true)
        const response = await main.createConsultation(
          doctor.doctor.id,
          store.user?.personId,
          startDateTime,
          60,
          selectedChild ? selectedChild : null
        );
        if (response.status === 200) {
          //alert("Вы успешно записаны!");
          /* console.log( `/payments/${response.data?.newPayment?.uuid4}`) */
          window.location.href = `/payments/${response.data?.newPayment?.uuid4}`;
          setLoading(false)
        } else {
          setLoading(false)
          alert("Не удалось записаться, попробуйте позже");
        }
      } else {
        setLoading(false)
        window.location.href = "/login";
      }
    } catch (error) {
      setLoading(false)
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
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />
      <div className="flex-grow">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Link
          href="/"
          onClick={() => setLoading(true)}
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Назад
        </Link>

        <div className="bg-white shadow rounded-lg p-6 flex gap-6 items-center">
          <img
            //src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            src={doctor?.doctor.User?.avatar}
            alt={`${doctor?.doctor.secondName} ${doctor?.doctor.firstName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {doctor?.doctor.secondName} {doctor?.doctor.firstName} {doctor?.doctor.patronomicName}
            </h1>
            {/* {doctor?.doctor.Posts.map((post) => (
              <span className="text-gray-600">{post.postName}</p>
            ))} */}
            {doctor?.doctor?.Posts && doctor.doctor.Posts.length > 0 ? (
              doctor.doctor.Posts.map((post) => (
                <a
                  key={post.id}
                  href={`/?post=${post.transliterationName}`}
                  className="hover:underline mt-1 text-xs leading-5 text-gray-500 truncate"
                >
                  {post.postName}{', '}
                </a>
              ))
            ) : (
              <p className="mt-1 text-xs leading-5 text-gray-500">Специальность не указана</p>
            )}

            
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Записаться на прием</h2>

          {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              className="mt-4"
              label="Дата"
              value={selectedDate}
              format="DD.MM.YYYY"
              onChange={handleDateChange}
              minDate={dayjs(new Date())}
              localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
              slotProps={{
                field: { clearable: true, onClear: () => handleDateChange(null) },
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider> */}
          {/* ====== ВЫБОР ДАТЫ ====== */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Выберите дату:</h3>
            <div className="flex flex-wrap gap-2">
              {doctor?.schedule && doctor.schedule.length > 0 ? (
                [...new Set(doctor.schedule.map(s => s.date))].map((dateStr) => {
                  const date = dayjs(dateStr);
                  const formatted = `${date.format("dd").charAt(0).toUpperCase() + date.format("dd").slice(1)} ${date.format("DD.MM")}`;
                  const isSelected = selectedDate?.isSame(date, "day");

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateChange(date)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {formatted}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500">Нет доступных дат</p>
              )}
            </div>
          </div>


          {selectedDate && (
            <TextField
              sx={{marginTop: 2}}
              select
              label="Время"
              value={selectedTime}
              //onChange={(e) => setSelectedTime(e.target.value)}
              onChange={handleSelectTime}
              fullWidth
            >
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Нет доступного времени</MenuItem>
              )}
            </TextField>
          )}
         

          {/* ====== ВЫБОР РЕБЁНКА ИЛИ ВХОД ====== */}
          <div className="mt-4">
            {!user ? (
              <div className="text-center">
                <p className="text-gray-600 mb-2">Чтобы записаться, необходимо авторизоваться</p>
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Войти
                </Link>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-2">У вас нет добавленных детей</p>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Добавить детей
                </Link>
              </div>
            ) : (
              <>
                {!showChildSelect ? (
                  <div className="text-center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setShowChildSelect(true)}
                    >
                      Выбрать ребёнка
                    </Button>
                  </div>
                ) : (
                  <TextField
                    select
                    label="Выберите ребёнка"
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(Number(e.target.value))}
                    fullWidth
                  >
                    {children.map((child) => (
                      <MenuItem key={child.id} value={child.id}>
                        {child.lastName} {child.firstName} {child.patronymicName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </>
            )}
          </div>

           
          {selectedTime && (
            <div className="mt-4">
              {loadingPrice ? (
                <p className="text-gray-500">Загрузка цены...</p>
              ) : price !== null ? (
                <p className="text-lg font-semibold text-gray-900">
                  Цена: {price} ₽
                </p>
              ) : (
                <p className="text-gray-500">Выберите время, чтобы увидеть цену</p>
              )}
            </div>
          )}

          <Button
              sx={{marginTop: 2}}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime }
          >
            Записаться
          </Button>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
    </>
  );
}

export default DoctorPage;
