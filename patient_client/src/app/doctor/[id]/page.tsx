'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

import DoctorListItemResponse from '@/types/main'
import main from "@/services/main";
import Header from "@/components/Header";
interface Doctor {
    id: string | undefined;
    firstName: string;
    secondName: string;
    patronomicName: string;
    postName: string;
    photo: string;
    schedule: string[];
    times: string[];
}

export default function page() {
    const params = useParams();
    const id = params.id as string;
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [doctor, setDoctor] = useState<DoctorListItemResponse>()
    const [doctorIsLoading, setDoctorIsLoading] = useState(true)

    useEffect(() => {
        console.log(id)
        fetchDoctorsList()
    }, [])
    const fetchDoctorsList = async () => {
        try {
            if (id) {
               const response = await main.getDoctor(parseInt(id), new Date())
                console.log(response.data)
                const data: DoctorListItemResponse = response.data
                
                
                setDoctor(data)
                setDoctorIsLoading(false) 
            }
            
        } catch (error) {
            console.log(error)
            setDoctorIsLoading(false)
        }
    } 

    if (doctorIsLoading && !doctor) {
        return (
            <>
                <Header/>
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <p className="text-gray-500">Загрузка информации...</p>
                </div>
            </>
            
        );
    }
    else {

    

        return (
            <>
                <Header/>
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
                            <div className="flex gap-2 mt-3">
                                {doctor?.schedule.map((day) => (
                                    <span
                                        key={day}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md border border-blue-300"
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Форма записи */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Записаться на прием
                        </h2>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Время
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Выберите время</option>
                            {/* {doctor.times.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                            ))} */}
                        </select>
                        </div>

                        <button
                        onClick={() =>
                            alert(
                            `Записаны к ${doctor?.doctor.secondName} ${doctor?.doctor.firstName} на ${selectedDate} в ${selectedTime}`
                            )
                        }
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
}
