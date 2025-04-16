import React, {useEffect, useState} from 'react'
import AdminService from '../../../../Services/AdminService';
import DoctorService from '../../../../Services/DoctorService';
import Header from '../../Header';
function Index() {


    const [events, setEvents] = useState([])
    const [schedule, setSchedule] = useState(new Map())
    const [doctors, setDoctors] = useState([])
    useEffect(() => {
        async function fetchDataSlots() {
            try {
                const response = await AdminService.getConsultations();
                response.data[0].map((slot) => {
                    let color = "red"
                    switch (slot.slotStatusId) {
                        case 1:
                            break;
                        case 2:
                            color = "#e5de00"
                            break;
                        case 3:
                            color = "#0ee500"
                            break;
                        case 4:
                            color = "#007aff"
                            break;
                    }
                    const newEvent = {
                        event_id: slot.id || Math.random(),
                        title: `Конференция ${slot?.dSecondName} ${slot?.dFirstName}`,
                        start: new Date(slot.slotStartDateTime),
                        end: new Date(slot.slotEndDateTime),
                        description: `Конференция. Врач: ${slot?.dSecondName} ${slot?.dFirstName}. Пациент: ${slot?.pSecondName} ${slot?.pFirstName}`,
                        patientUrl: process.env.REACT_APP_SERVER_URL + '/short/' + slot.pUrl,
                        doctorUrl:  process.env.REACT_APP_SERVER_URL + '/short/' + slot.dUrl,
                        doctorId: slot.doctorId,
                        patientId: slot.patientId,
                        dotorSecondName: slot?.dSecondName,
                        dotorFirstName: slot?.dFirstName,
                        patientSecondName: slot?.pSecondName,
                        patientFirstName: slot?.pFirstName,
                        color: color,
                        slotStatus: slot.slotStatusId
                    }
                    setEvents((prevEvents) => [...prevEvents, newEvent]);
                })
                return response.data[0]
            }
            catch (e) {
                console.log(e)
                /* alert(e.response.data.error) */
            }
            
        }
        fetchDataSlots()
        handleFetchDoctors()
    }, []) 

    useEffect(() => {
        console.log(doctors)
    }, [doctors])

    useEffect(() => {
        if (doctors.length > 0) {
            doctors.forEach(doctor => {
                handleFetchSchedule(doctor);
            });
        }
    }, [doctors])

    const handleFetchDoctors = async () => {
        try {
            const response = await AdminService.getDoctors();
            setDoctors(response.data);
        } catch (e) {
            alert('Ошибка загрузки врачей');
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
            console.log(schedule)
            setSchedule(response.data);
        } catch (e) {
            alert('Ошибка загрузки расписания');
        }
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
                    {[...Array(7)].map((_, i) => (
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
                        <h2>Иван Иванович</h2>
                        <div>
                        <strong>Занято:</strong>
                        <div>18:00 - 18:30</div>
                        <div>18:00 - 18:30</div>
                        <div>18:00 - 18:30</div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                        <h3>Свободно:</h3>
                        <div>10:00 - 18:00</div>
                        <div>18:30 - 20:00</div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Index