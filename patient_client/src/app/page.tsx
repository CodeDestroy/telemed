'use client'

import { observer } from 'mobx-react-lite'
import Header from '@/components/Header'
import { useStore } from '@/store'
import { useEffect, useState } from 'react'
import main from '@/services/main'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import DoctorListItemResponse from '@/types/main'
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import Post from '@/types/posts'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Doctor } from '@/types/doctor'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import Loader from '@/components/Loader'
import { ScheduleShort } from '@/types/schedule'

function Home () {
    const [date, setDate] = useState<Dayjs | null>(null);
    const [doctorsListIsLoading, setDoctorsListIsLoading] = useState(true)
    
    const [postsList, setPostsList] = useState<Post[]>([])

    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [inputPostValue, setInputPostValue] = useState('')

    const [sortedList, setSortedList] = useState<DoctorListItemResponse[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [doctorListWithSchedule, setDoctorListWithSchedule] = useState<DoctorListItemResponse[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [inputDoctorValue, setinputDoctorValue] = useState('')
    const medOrgId = process.env.NEXT_PUBLIC_MED_ORG_ID
    const fetchDoctorsList = async () => {
        try {
            const response = await main.getDoctorList(new Date(), medOrgId)
            setDoctorListWithSchedule(response.data)
            const data: DoctorListItemResponse[] = response.data
            const list: Doctor[] = []
            data.map((item) => {
                list.push(item.doctor)
            })
            setDoctors(list)
            setDoctorsListIsLoading(false)
        } catch (error) {
            console.log(error)
            setDoctorsListIsLoading(false)
        }
    } 

    const fetchSpetialityList = async () => {
        try {
            const response = await main.getPostsList()
            setPostsList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDoctorsList()
        fetchSpetialityList()
    }, [])

    /* useEffect(() => {
        if (doctorListWithSchedule.length) {
            console.log(doctorListWithSchedule)
        }
    }, [doctorListWithSchedule]) */

    useEffect(() => {
        let filtered = [...doctorListWithSchedule]

        // Фильтрация по специальности
        if (selectedPost) {
            filtered = filtered.filter(item => item.doctor?.Post?.id === selectedPost.id)
        }

        // Фильтрация по врачу
        if (selectedDoctor) {
            filtered = filtered.filter(item => item.doctor?.id === selectedDoctor.id)
        }

        // Пример сортировки по фамилии (можно заменить на любую другую)
        filtered.sort((a, b) => {
            const nameA = a.doctor?.secondName || ''
            const nameB = b.doctor?.secondName || ''
            return nameA.localeCompare(nameB)
        })

        setSortedList(filtered)
    }, [selectedPost, selectedDoctor, date, doctorListWithSchedule])


    /* const handleSelectDoctor = (doctor: Event) => {

        console.log(doctor)
    } */

    return (
        <>
            <Header/>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'> 
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <Box
                        >
                            
                            <DesktopDatePicker
                                    sx={{ width: '100%' }}
                                    value={date}
                                    format="DD.MM.YYYY"
                                    label='Дата'
                                    onChange={(date) => {setDate(date)}}
                                    minDate={dayjs(new Date())}
                                    localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
                                    slotProps={{
                                        field: { clearable: true, onClear: () => setDate(null) },
                                    }}
                            />
                        </Box>
                    </LocalizationProvider> */}
                    <Autocomplete
                        options={postsList}
                        value={selectedPost}
                        onChange={(event, newValue) => {
                            setSelectedPost(newValue)
                        }}
                        inputValue={inputPostValue}
                        onInputChange={(event, newInputValue) => {
                            setInputPostValue(newInputValue)
                        }}
                        getOptionLabel={(option) =>
                            option ? `${option.postName}` : ''
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Выберите специальность"
                            />
                        )}
                        fullWidth
                        sx={{
                            '& input': {
                                outline: 'none !important',       
                                boxShadow: 'none !important',    
                            },
                        }}
                    />
                    <Autocomplete
                        options={doctors}
                        value={selectedDoctor}
                        onChange={(event, newValue) => {
                            setSelectedDoctor(newValue)
                        }}
                        inputValue={inputDoctorValue}
                        onInputChange={(event, newInputValue) => {
                            setinputDoctorValue(newInputValue)
                        }}
                        getOptionLabel={(option) =>
                            option ? `${option.secondName} ${option.firstName} ${option.patronomicName}` : ''
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Выберите врача"
                            />
                        )}
                        className='col-span-1 sm:col-span-2'
                        fullWidth
                        sx={{
                            '& input': {
                                outline: 'none !important',       // ❌ убираем outline
                                boxShadow: 'none !important',     // ❌ убираем ring
                            },
                            
                        }}
                    />
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-full">
                    {doctorsListIsLoading ? (
                        <div style={{top: '30%'}} className='relative text-center'><Loader/></div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-100">
                            {sortedList.length > 0 && sortedList.map((item) => 
                                {
                                    if (!item?.doctor || !item.doctor?.Post) {
                                        console.warn('Неполные данные у элемента:', item)
                                        return null
                                    }
                                    return (
                                        <li
                                            key={item.doctor.id}
                                            className="relative grid grid-cols-1 gap-y-4 gap-x-6 py-5 sm:grid-cols-12"
                                            >
                                            {/* Левая часть: фото + ФИО */}
                                            <div className="flex min-w-0 gap-x-4 sm:col-span-7">
                                                <img
                                                alt=""
                                                src={item.doctor.User?.avatar}
                                                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                                />
                                                <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    <a href={`/doctor/${item.doctor.id}`}>
                                                    {item.doctor.secondName} {item.doctor.firstName} {item.doctor.patronomicName}
                                                    </a>
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
                                                    <a
                                                    href={`/post/${item.doctor.Post.postName}`}
                                                    className="hover:underline"
                                                    >
                                                    {item.doctor.Post.postName}
                                                    </a>
                                                </p>
                                                </div>
                                            </div>

                                            {/* Средняя колонка: расписание */}
                                            <div className="flex flex-wrap gap-2 sm:col-span-3">
                                                {item.schedule.length > 0 ? item.schedule.map((scheduleItem, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-2 py-1 text-sm font-medium text-gray-800 bg-blue-100 border border-blue-300 rounded-md text-center min-w-[90px]"
                                                    >
                                                        {scheduleItem.name} {dayjs(scheduleItem.date).format('DD.MM')}
                                                    </div>
                                                    ))
                                                    :
                                                    <div
                                                        key={item.doctor.id}
                                                        className="px-2 py-1 text-sm font-medium text-gray-800 bg-red-100 border border-red-300 rounded-md text-center min-w-[90px]"
                                                    >
                                                        Нет свободных слотов
                                                    </div>
                                                }
                                            </div>

                                            {/* Правая колонка: действие */}
                                            <div className="flex items-center justify-between sm:justify-end sm:col-span-2">
                                                <a
                                                    href={`/doctor/${item.doctor.id}`}
                                                    className="cursor-pointer text-sm leading-6 text-gray-900"
                                                >
                                                    Записаться
                                                </a>
                                                <ChevronRightIcon
                                                    aria-hidden="true"
                                                    className="h-5 w-5 flex-none text-gray-400"
                                                />
                                            </div>
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    )}
                </div>
            </div>
            
        </>
        
    )
}

export default observer(Home)
