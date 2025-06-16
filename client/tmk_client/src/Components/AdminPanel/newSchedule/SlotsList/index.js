import React, {useEffect, useState} from 'react'
import AdminService from '../../../../Services/AdminService';
import DoctorService from '../../../../Services/DoctorService';
import Header from '../../Header';
import CreateSlotModal from './CreateSlotModal';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
function Index() {

    const [schedule, setSchedule] = useState(new Map())
    const [doctors, setDoctors] = useState([])
    const [scheduleLoaded, setScheduleLoaded] = useState(false)
    const [reservedSlots, setReservedSlots] = useState([])
    const [splitedSchedule, setSplitedSchedule] = useState(null)

    const [showModal, setModalShow] = useState(false)
    const handleShowModal = (item, doctor) => {
        setModalShow(true)
        setSelectedItem(item)
        setSelectedDoctor(doctor)
    }

    const handleCloseModal = () => {
        setModalShow(false)
        setSelectedItem(null)
    }

    useEffect(() => {
        handleFetchDoctors()
        handleFetchReservedSlots()
    }, []) 

    useEffect(() => {
        if (doctors.length > 0) {
            doctors.forEach(async (doctor, index) => {
                await handleFetchSchedule(doctor);
                if (index === doctors.length - 1) {
                    setScheduleLoaded(true)
                }
            });
            
        }
    }, [doctors])

    useEffect(() => {
        if (scheduleLoaded)
        {
            const newScheduleMap = new Map();

            Array.from(schedule.entries()).forEach(([doctor, schedule]) => {
                const slots = splitScheduleBy30Min(schedule);
                newScheduleMap.set(doctor, slots);
            });
            setSplitedSchedule(newScheduleMap)
        }
    }, [scheduleLoaded])

    const handleFetchDoctors = async () => {
        try {
            const response = await AdminService.getDoctors();
            setDoctors(response.data);
        } catch (e) {
            alert('Ошибка загрузки врачей');
        }
    }

    const handleFetchReservedSlots = async () => {
        try {
            const response = await AdminService.getConsultationsByDate(new Date());
            setReservedSlots(response.data[0])
        } catch (e) {
            alert('Ошибка загрузки занятых слотов');
        }
    }

    const handleFetchSchedule = async (doctor) => {
        if (!doctor) {
            alert('Выберите врача');
            return;
        }
        try {
            const response = await DoctorService.getScheduleByDateV2(doctor.id, new Date());
            schedule.set(doctor, response.data);
        } catch (e) {
            alert('Ошибка загрузки расписания');
        }
    };

    function splitScheduleBy30Min(schedule) {
        const slots = [];

        schedule.forEach(item => {
            const date = item.date; // "2025-05-13", используется чтобы собрать полный Date-объект

            const startTime = new Date(`${date}T${item.scheduleStartTime}`);
            const endTime = new Date(`${date}T${item.scheduleEndTime}`);

            let currentStart = new Date(startTime);

            while (currentStart < endTime) {
            const currentEnd = new Date(currentStart.getTime() + 30 * 60 * 1000); // +30 минут

            // Если слот выходит за пределы расписания — обрезаем
            if (currentEnd > endTime) break;

            slots.push({
                ...item,
                scheduleStartTime: currentStart.toTimeString().slice(0, 8),
                scheduleEndTime: currentEnd.toTimeString().slice(0, 8),
            });

            currentStart = currentEnd;
            }
        });

        return slots;
    }

    const [selectedItem, setSelectedItem] = useState(null)
    const [selectedDoctor, setSelectedDoctor] = useState(null)

    const DoctorScheduleList = ({ scheduleMap }) => {
        const entries = Array.from(scheduleMap.entries());
        
        return (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {entries.map(([doctor, schedule], i) => {
                    const fullName = `${doctor.firstName} ${doctor.patronomicName} ${doctor.secondName}`;

                    const busy = [];
                    const free = [];

                    for (const slot of schedule) {
                        let isBusy = false
                        let busySlot = null
                        reservedSlots.forEach((reserved) => {
                            const reservedTime = new Date(reserved.slotStartDateTime).toTimeString().slice(0, 8);
                            if (reserved.doctorId === slot.doctorId && reservedTime === slot.scheduleStartTime)
                            {
                                isBusy = true
                                busySlot = reserved
                                return
                            }
                            else {
                                isBusy = false
                                busySlot = null
                            }
                        })               
                        if (isBusy) {
                            busy.push(busySlot);
                        } else {
                            free.push(slot);
                        }
                    }
                    /* splitedSchedule.set(doctor, free); */
            
                    return (
                        <div
                            className="doctor-card"
                            key={i}
                            style={{
                                minWidth: '280px',
                                flexShrink: 0,
                                background: '#f9f9f9',
                                padding: '1rem',
                                borderRadius: '10px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                            >
                            <h2>{fullName}</h2>
                            <div>
                                <strong>Занято:</strong>
                                {busy.length > 0 ? (
                                    busy.map((item, index) => {
                                        return (
                                        <div key={'busy_' + item.id+'_'+index}>
                                            <Button  className='fs-3'>
                                                {dayjs(item.slotStartDateTime).format('hh:mm')} - {dayjs(item.slotEndDateTime).format('hh:mm')}
                                            </Button>
                                        </div>
                                    )})
                                    ) : (
                                    <div>Нет</div>
                                )}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h3>Свободно:</h3>
                                {free.length > 0 ? (
                                    free.map((item, index) => (
                                        <div key={'free_' + item.id+'_'+index}>
                                            <Button onClick={() => {handleShowModal(item, doctor)}} className='fs-3'>
                                                {item.scheduleStartTime} - {item.scheduleEndTime}
                                            </Button>
                                        </div>
                                    ))
                                    ) : (
                                    <div>Нет свободных слотов</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
      
    return (
        <>
            <Header/>
            <div className="container">
                <h1>Расписание</h1>
                <div
                    className="doctors-wrapper"
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        gap: '1rem',
                        maxWidth: '100%',
                    }}
                >
                    {
                        splitedSchedule && scheduleLoaded ? 
                        <DoctorScheduleList scheduleMap={splitedSchedule} />

                        : 'Не загрузилось расписание'
                    }
                </div>
            </div>
            <div>
                <CreateSlotModal show={showModal} onHide={handleCloseModal} onClose={handleCloseModal} item={selectedItem} doctor={selectedDoctor} open={showModal}/>
            </div>
        </>
    )
}

export default Index