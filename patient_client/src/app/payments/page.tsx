'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

import Header from "@/components/Header";
import { useStore } from '@/store'
import { PaymentInformationPageResponse } from "@/types/payment";
import PaymentService from "@/services/payments";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const PaymentsPage = () => {
  
  const [loading, setLoading] = useState(false)
  const store = useStore()
  const [payments, setPayments] = useState<PaymentInformationPageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (store.user && store.isAuth) fetchPayments();
  }, [store.user]);

  const fetchPayments = async () => {
    try {
      const response = await PaymentService.getPaymentsByUserId(store.user?.id)
      const sortedData = response.data.sort((a, b) => {
        return a.Slot.slotStartDateTime < b.Slot.slotStartDateTime ? 1 : -1
      })
      setPayments(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-gray-500">Загрузка платежей...</p>
        </div>
        <Footer/>
      </>
    );
  }

  const getStatusProps = (statusId: number) => {
    switch(statusId) {
      case 1: return { text: 'В ожидании', color: 'text-yellow-600', bgColor: 'bg-yellow-100 border-yellow-300' };
      case 2: return { text: 'В обработке', color: 'text-blue-600', bgColor: 'bg-blue-100 border-blue-300' };
      case 3: return { text: 'Оплачено', color: 'text-green-600', bgColor: 'bg-green-100 border-green-300' };
      case 4: return { text: 'Ошибка оплаты', color: 'text-red-600', bgColor: 'bg-red-100 border-red-300' };
      case 5: return { text: 'Отмена оплаты', color: 'text-gray-600', bgColor: 'bg-gray-100 border-gray-300' };
      default: return { text: 'Неизвестно', color: 'text-gray-600', bgColor: 'bg-gray-100 border-gray-300' };
    }
  };

  const renderPaymentCard = (p: PaymentInformationPageResponse) => {
    const { id, amount, createdAt, paymentStatusId, uuid4, Slot } = p;
    const doctor = Slot.Doctor;

    // ⏳ Время для оплаты (только для статуса 1)
    const deadline = dayjs(createdAt).add(20, "minute");
    const now = dayjs();
    const minutesLeft = deadline.diff(now, "minute");
    const isExpired = minutesLeft <= 0;

    const statusProps = getStatusProps(paymentStatusId);

    return (
      <Link
        key={id}
        href={`/payments/${uuid4}`}
        onClick={() => setLoading(true)}
        className="block bg-white shadow rounded-lg p-6 hover:shadow-md transition"
      >
        <div className="flex gap-4 items-center">
          <img
            src={doctor?.User?.avatar || "/default-avatar.png"}
            alt={`${doctor?.secondName} ${doctor?.firstName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {doctor?.secondName} {doctor?.firstName} {doctor?.patronomicName}
            </h3>
            {doctor?.Posts && doctor?.Posts.length > 0 && 
              doctor?.Posts.map((post) => (
                <p
                    key={post.id}
                    className="mt-1 text-xs leading-5 text-gray-500 truncate text-gray-600"
                >
                    {post.postName}{' '}
                </p>
              ))
            }
            <p className="text-gray-500">{dayjs(Slot.slotStartDateTime).format("DD.MM.YYYY HH:mm")}</p>

            {/* Предупреждение о времени оплаты */}
            {paymentStatusId === 1 && (
              <div
                className={`mt-2 p-2 rounded-lg text-sm bg-yellow-100 text-yellow-700 border border-yellow-300`}
              >
                {isExpired
                  ? "Время для оплаты истекло"
                  : `Осталось ${minutesLeft} мин. для оплаты`}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold">{amount} ₽</p>
            <p className={`text-sm ${statusProps.color}`}>{statusProps.text}</p>
          </div>
        </div>
      </Link>
    );
  };

      
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
      <Header />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Link
          href="/"
          onClick={() => setLoading(true)}
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> На главную
        </Link>

        {/* Платежи */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Мои платежи</h2>
          {payments.length > 0 ? (
            payments.map(renderPaymentCard)
          ) : (
            <p className="text-gray-500">Платежей пока нет</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PaymentsPage;
