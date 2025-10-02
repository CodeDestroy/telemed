'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { useStore } from '@/store'
import Header from "@/components/Header";

import { PaymentInformationPageResponse } from "@/types/payment";
import { Doctor } from "@/types/doctor";
import PaymentService from "@/services/payments";

const PaymentPage = () => {
  const store = useStore();
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<PaymentInformationPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && store.isAuth) fetchPayment();
  }, [store.user, id]);

  const fetchPayment = async () => {
    try {
      const response = await PaymentService.getPaymentInformation(id);
      if (response.status === 200) setData(response.data);
      else alert('Ошибка получения данных');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handlePay = () => {
    if (data?.yookassa_confirmation_url) {
      window.open(data.yookassa_confirmation_url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Для платежа ${data?.uuid4} ссылка на оплату отсутствует`);
    }
  };

  const handleCheckPay = async () => {
    try {
      const response = await PaymentService.checkPayment(data?.uuid4 || '');
      if (response.status == 200) {
        location.reload()
      }
    } 
    catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  }

  const getStatusProps = (statusId: number) => {
    switch (statusId) {
      case 1: return { text: 'В ожидании', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-300' };
      case 2: return { text: 'В обработке', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' };
      case 3: return { text: 'Оплачено', color: 'text-green-700', bg: 'bg-green-100 border-green-300' };
      case 4: return { text: 'Ошибка оплаты', color: 'text-red-700', bg: 'bg-red-100 border-red-300' };
      case 5: return { text: 'Отмена оплаты', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-300' };
      default: return { text: 'Неизвестно', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-300' };
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-gray-500">Загрузка информации о платеже...</p>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-red-500">Платеж не найден</p>
        </div>
      </>
    );
  }

  const { amount, createdAt, paymentStatusId, uuid4, Slot } = data;
  const doctor: Doctor = Slot?.Doctor;
  const statusProps = getStatusProps(paymentStatusId);

  // Время для оплаты (только для статуса 1)
  const deadline = dayjs(createdAt).add(20, "minute");
  const now = dayjs();
  const minutesLeft = deadline.diff(now, "minute");
  const isExpired = minutesLeft <= 0;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Link
          href="/payments"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Назад
        </Link>

        {/* Информация о враче */}
        <div className="bg-white shadow rounded-lg p-6 flex gap-6 items-center">
          <img
            src={doctor?.User?.avatar || "/default-avatar.png"}
            alt={`${doctor?.secondName} ${doctor?.firstName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {doctor?.secondName} {doctor?.firstName} {doctor?.patronomicName}
            </h1>
            <p className="text-gray-600">{doctor?.Post?.postName}</p>
            <p className="text-gray-500">{doctor?.MedOrg?.medOrgName}</p>
          </div>
        </div>

        {/* Информация о платеже */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Информация о платеже</h2>
          <p>
            <span className="font-semibold">Дата и время:</span>{" "}
            {dayjs(Slot?.slotStartDateTime).format("DD.MM.YYYY HH:mm")} –{" "}
            {dayjs(Slot?.slotEndDateTime).format("HH:mm")}
          </p>
          <p>
            <span className="font-semibold">Сумма:</span> {amount} ₽
          </p>
          <p>
            <span className="font-semibold">Статус:</span>{" "}
            <span className={`${statusProps.color} font-semibold`}>
              {statusProps.text}
            </span>
          </p>

          {/* Предупреждение о времени оплаты */}
          {paymentStatusId === 1 && (
            <div className={`p-3 rounded-lg text-sm ${isExpired ? "bg-red-100 text-red-700 border border-red-300" : statusProps.bg}`}>
              {isExpired
                ? "Время для оплаты истекло. Платёж просрочен."
                : `Время для оплаты ограничено. У вас осталось ${minutesLeft} мин.`}
            </div>
          )}

          {/* Кнопка оплаты только для статуса 1 и если не просрочен */}
          {!isExpired && (paymentStatusId === 1 || paymentStatusId === 2 || paymentStatusId === 4) && (
            <>
              <button
                onClick={handlePay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
              >
                Оплатить
              </button>
              <button
                onClick={handleCheckPay}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
              >
                Проверить статус платежа
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
