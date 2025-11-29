import React, {useEffect, useState, useContext} from 'react'
import AdminService from '../../../../Services/AdminService';
import SchedulerService from '../../../../Services/SchedulerService';

import DoctorService from '../../../../Services/DoctorService';
import Header from '../../Header';
import CreateSlotModal from '../CreateSlotModal';
import dayjs from 'dayjs';
import { Button, IconButton, Stack, Autocomplete, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { Context } from '../../../../';
import EditSlotModal from '../EditSlot';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


function Index() {

    const { store } = useContext(Context);
    const [schedule, setSchedule] = useState(new Map())
    const [doctors, setDoctors] = useState([])
    const [scheduleLoaded, setScheduleLoaded] = useState(false)
    const [splitedSchedule, setSplitedSchedule] = useState(null)

    const [startDate, setStartDate] = useState(new Date())
    const [selectedServiceId, setSelectedServiceId] = useState("all");
    const [selectedDoctorId, setSelectedDoctorId] = useState("all");

    /* const [endDate, setEndDate] = useState(new Date()) */

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
    const [showEditModal, setEditModalShow] = useState(false)
    const handleEditShowModal = (item) => {
        setEditModalShow(true)
        setSelectedItem(item)
    }

    const handleEditCloseModal = () => {
        setEditModalShow(false)
        setSelectedItem(null)
    }

    const serviceTypes = React.useMemo(() => {
        const allTypes = new Map();

        for (const [, slots] of schedule) {
            for (const s of slots) {
                if (s.Service) {
                    allTypes.set(s.Service.id, s.Service.serviceShortName);
                }
            }
        }

        return Array.from(allTypes.entries()).map(([id, name]) => ({
            id,
            name
        }));
    }, [schedule]);


    

    useEffect(() => {
        if (scheduleLoaded)
        {
            const newScheduleMap = new Map();

            Array.from(schedule.entries()).forEach(([doctor, schedule]) => {
                newScheduleMap.set(doctor, schedule);
            });
            setSplitedSchedule(newScheduleMap)
        }
    }, [schedule, scheduleLoaded])

    const handleFetchDoctors = async () => {
        try {
            const response = await AdminService.getDoctors(store.selectedProfile.id);
            setDoctors(response.data);
        } catch (e) {
            alert('Ошибка загрузки врачей');
        }
    }

    const handleFetchSchedule = async () => {
        try {
            const newMap = new Map();

            for (const doctor of doctors) {
                try {
                    const response = await SchedulerService.getDcotorSchedule(
                        doctor.id,
                        startDate,
                        startDate
                    );

                    newMap.set(doctor, response.data);
                } catch (e) {
                    console.log("Ошибка загрузки конкретного врача:", e);
                }
            }

            setSchedule(newMap);
            setScheduleLoaded(true);
        } catch (e) {
            console.log("Ошибка загрузки расписания:", e);
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

    function splitScheduleBy60Min(schedule) {
        const slots = [];

        schedule.forEach(item => {
            const date = item.date; // "2025-05-13", используется чтобы собрать полный Date-объект

            const startTime = new Date(`${date}T${item.scheduleStartTime}`);
            const endTime = new Date(`${date}T${item.scheduleEndTime}`);

            let currentStart = new Date(startTime);

            while (currentStart < endTime) {
            const currentEnd = new Date(currentStart.getTime() + 60 * 60 * 1000); // +30 минут

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

    const [customMenu, setCustomMenu] = useState({
        open: false,
        top: 0,
        left: 0,
        item: null,
    });

    const handleMenuOpen = (event, item) => {
        event.preventDefault(); // обязательно, чтобы event.currentTarget был доступен

        const rect = event.currentTarget.getBoundingClientRect();
        setCustomMenu({
            open: true,
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            item,
        });
        setSelectedItem(item);
    };
    

    const handleMenuClose = () => {
        setCustomMenu({ open: false, top: 0, left: 0, item: null });
        /* setSelectedItem(null); */
    };

    const handleEdit = () => {
        // Реализуй логику редактирования
        handleEditShowModal(selectedItem)
        /* handleMenuClose(); */
    };

    const handleDelete = async () => {
        // Реализуй логику удаления
        try {
            //Тут сделать отмену слота
            handleMenuClose();
        }
        catch (e) {
            console.log(e)
        }
        
    };

    useEffect(() => {
        handleFetchDoctors()
        //handleFetchReservedSlots()
    }, []) 

    useEffect(() => {
        if (doctors.length > 0)
            handleFetchSchedule()
    }, [doctors])

    /* useEffect(() => {
        setEndDate(startDate);
    }, [startDate]); */

    useEffect(() => {
        if (doctors.length > 0) {
            handleFetchSchedule();
        }
    }, [startDate]);



    /* useEffect(() => {
        if (doctors.length > 0) {
            doctors.forEach(async (doctor, index) => {
                await handleFetchSchedule(doctor);
                if (index === doctors.length - 1) {
                    setScheduleLoaded(true)
                }
            });
            
        }
    }, [doctors, handleFetchSchedule]) */

    const DoctorScheduleList = ({ scheduleMap }) => {
        const entries = Array.from(scheduleMap.entries());

        // Фильтр по врачу
        const filteredEntries = entries.filter(([doctor]) =>
            selectedDoctorId === "all" ? true : doctor.id === selectedDoctorId
        );

        return (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {filteredEntries.map(([doctor, schedule], i) => {
                    const fullName = `${doctor.firstName} ${doctor.patronomicName} ${doctor.secondName}`;

                    // группировка по serviceId
                    const grouped = {};
                    schedule.forEach(slot => {
                        if (!slot.Service) return;
                        if (!grouped[slot.Service.id]) {
                            grouped[slot.Service.id] = {
                                name: slot.Service.serviceShortName,
                                slots: []
                            };
                        }
                        grouped[slot.Service.id].slots.push(slot);
                    });

                    const serviceGroups = Object.entries(grouped)
                        .sort((a, b) => a[0] - b[0]); // сортировка по id

                    return (
                        <div
                            key={i}
                            style={{
                                minWidth: '300px',
                                background: '#fff',
                                borderRadius: '10px',
                                padding: '1rem',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                            }}
                        >
                            <h2>{fullName}</h2>

                            {serviceGroups
                                .filter(([serviceId]) =>
                                    selectedServiceId === "all" ? true : Number(serviceId) === Number(selectedServiceId)
                                )
                                .map(([serviceId, group]) => (
                                    <div key={serviceId} style={{ marginTop: "1rem" }}>
                                        <h3>{group.name}</h3>

                                        {/* разделение на занято/свободно */}
                                        <div>
                                            <strong>Занято:</strong>
                                            {group.slots.filter(s => s.scheduleStatus != 1 || s.slotId).length === 0
                                                ? <div>Нет</div>
                                                : group.slots
                                                    .filter(s => s.scheduleStatus != 1 || s.slotId)
                                                    .map(s => (
                                                        <Stack key={s.id} direction="row" alignItems="center">
                                                            <Button variant="contained">
                                                                {s.scheduleStartTime.slice(0, 5)} - {s.scheduleEndTime.slice(0, 5)}
                                                            </Button>
                                                            <IconButton onClick={(e) => handleMenuOpen(e, s)}>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    ))
                                            }
                                        </div>

                                        <div style={{ marginTop: "0.5rem" }}>
                                            <strong>Свободно:</strong>
                                            {group.slots.filter(s => s.scheduleStatus == 1 && !s.slotId).length === 0
                                                ? <div>Нет</div>
                                                : group.slots
                                                    .filter(s => s.scheduleStatus == 1 && !s.slotId)
                                                    .map(s => (
                                                        <Button
                                                            key={s.id}
                                                            onClick={() => handleShowModal(s, doctor)}
                                                        >
                                                            {s.scheduleStartTime.slice(0, 5)} - {s.scheduleEndTime.slice(0, 5)}
                                                        </Button>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                ))}
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
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                        fontSize: "1.5rem",
                    }}
                >
                    <IconButton onClick={() => setStartDate(dayjs(startDate).subtract(1, "day").toDate())}>
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <div style={{ minWidth: "150px", textAlign: "center" }}>
                        {dayjs(startDate).format("DD.MM.YYYY")}
                    </div>

                    <IconButton onClick={() => setStartDate(dayjs(startDate).add(1, "day").toDate())}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <Autocomplete
                        sx={{ width: 250 }}
                        options={[{ id: "all", label: "Все врачи" }, ...doctors.map(d => ({
                            id: d.id,
                            label: `${d.firstName} ${d.patronomicName} ${d.secondName}`
                        }))]}
                        value={
                            selectedDoctorId === "all"
                                ? { id: "all", label: "Все врачи" }
                                : doctors.map(d => ({
                                    id: d.id,
                                    label: `${d.firstName} ${d.patronomicName} ${d.secondName}`
                                })).find(d => d.id === selectedDoctorId)
                        }
                        onChange={(e, value) => setSelectedDoctorId(value?.id || "all")}
                        renderInput={(params) => <TextField {...params} label="Врач" />}
                    />

                    <TextField
                        select
                        label="Тип приёма"
                        sx={{ width: 250 }}
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        SelectProps={{ native: true }}
                    >
                        <option value="all">Все типы</option>
                        {serviceTypes.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </TextField>
                </div>

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
                <EditSlotModal show={showEditModal} onHide={handleEditCloseModal} onClose={handleEditCloseModal} item={selectedItem} open={showEditModal}/>
            </div>
            {customMenu.open && (
                <div
                    style={{
                        position: 'absolute',
                        top: customMenu.top,
                        left: customMenu.left,
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        padding: '8px 0',
                        zIndex: 9999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                    onMouseLeave={handleMenuClose}
                >
                    <div
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onClick={() => {
                            handleEdit();
                            handleMenuClose();
                        }}
                    >
                        <EditIcon fontSize="small" /> Редактировать
                    </div>

                    {/* <div
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            color: 'red'
                        }}
                        onClick={() => {
                            handleDelete();
                            handleMenuClose();
                        }}
                    >
                        Удалить
                    </div> */}
                </div>
            )}

        </>
    )
}

export default Index