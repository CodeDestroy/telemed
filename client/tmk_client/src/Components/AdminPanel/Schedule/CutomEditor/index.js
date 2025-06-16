import { TextField, Button, DialogActions, Autocomplete, Box, Stack, Select, MenuItem } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from 'react'
import AdminService from "../../../../Services/AdminService";
import SchedulerService from "../../../../Services/SchedulerService";
import DoctorService from "../../../../Services/DoctorService";
import {ru} from 'date-fns/locale/ru';
import { blue, grey } from '@mui/material/colors';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import adminLocations from "../../../../Locations/AdminLocations";

import PatientCreateModal from '../../Modals/Patients/Create';
const white = '#fff'
function CustomEditor ({ scheduler, onStateChange }) {

    const defaultTheme = createTheme({
        palette: {
          primary: {
            main: blue[700],
          },
          secondary: {
            main: grey[50],
          },
          background: {
            default: white,
          },
        },
    });
    const event = scheduler.edited;
    const [doctors, setDoctors] = useState([]);
    const [inputDoctorValue, setInputDoctorValue] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null)

    const [patients, setPatients] = useState([]);
    const [inputPatientValue, setInputPatientValue] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null)

    const [groupedSchedule, setGroupedSchedule] = useState([])
    const [activeConsultations, setActiveConsultations] = useState([])
    const [selectedDate, setSelectedDate] = useState(scheduler.state.start.value)
    const [selectedTime, setSelectedTime] = useState(null)
    const [duration, setDuration] = useState('30')
    const [slotStatuses, setSlotStatuses] = useState([])
    const now = new Date()
    // Make your own form/state
    const [state, setState] = useState({
        title: event?.title || "",
        description: event?.description || "",
        doctor: selectedDoctor || null,
        patient: selectedPatient || null,
        start: (scheduler.state.start.value) ||  selectedTime,
        duration: duration || null,
        doctorId: selectedDoctor?.id || (scheduler.state.doctorId.value),
        patientId: selectedPatient?.id || (scheduler.state.patientId.value),
        slotStatusId: event?.slotStatusId ?? ""
    });

    useEffect(() => {
        fetchSlotStatuses()
    }, [])

    const fetchSlotStatuses = async () => {
        try {
            const response = await AdminService.getSlotStatuses()
            console.log(response.data)
            setSlotStatuses(response.data)
        }
        catch (e) {
            console.log(e)
        }
    }

    const [error, setError] = useState("");
    const [editing, setEditing] = useState(scheduler.state.event_id.value ? true : false)
    const [open, setOpen] = useState(false);

    const handleClose = () => {setOpen(false);};
    const handleOpen = () => {setOpen(true);};
  
    const handleChange = (value, name) => {
        setState((prev) => {
            return {
            ...prev,
            [name]: value
            };
        });
        
    };

    const handleChangeStatus = (event) => {
        const newValue = event.target.value;
        setState(prev => ({
            ...prev,
            slotStatusId: newValue
        }));
    };

    const handleSubmit = async () => {
        if (state.title.length < 3) {
            return setError("Min 3 letters");
        }
    
        try {
            /* scheduler.loading(true);
            console.log(state.doctor)
            console.log(state.patient)
            console.log(state.start)
            console.log(state.duration) */
            
            /* return $api.post('/api/admin/consultations/create', {doctor, patient, startDateTime, duration}) */
            const response = await AdminService.createSlot(state.doctor, state.patient, state.start, state.duration)
    
            if (response.status == 200) {
                const addedEvent = {
                    event_id: event?.event_id || Math.random(),
                    title: state.title,
                    start: state.start,
                    end: dayjs(state.start).add(30, 'minute'),
                    description: state.description,
                    patientUrl: process.env.REACT_APP_SERVER_URL + '/short/' + response.data.patientShortUrl,
                    doctorUrl:  process.env.REACT_APP_SERVER_URL + '/short/' + response.data.doctorShortUrl
                };
    
                scheduler.onConfirm(addedEvent, event ? "edit" : "create");
                scheduler.close();
            } else if (response.status === 500) {
                setError("Ошибка сервера: не удалось сохранить событие");
            } else {
                setError("Не удалось сохранить событие, попробуйте снова");
            }
    
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            setError("Произошла ошибка при отправке данных");
        } finally {
            scheduler.loading(false);
        }
    };

    async function fetchDoctors() {
        let response = await AdminService.getDoctors();
        response.data.map((doc) => {
            doc.label = doc.secondName + " " + doc.firstName + " " + doc.patronomicName;
        })
        return response.data
    }
    async function fetchPatients() {
        let response = await AdminService.getPatients()
        response.data.map((doc) => {
            doc.label = doc.secondName + " " + doc.firstName + " " + doc.patronomicName;
        })
        return response.data
    }
    useEffect(() => {
        /* console.log(scheduler.state) */
        fetchDoctors()
        .then((data) => {
            setDoctors(data)
            if (!state.doctorId) {
                setSelectedDoctor(data[0])
                getDoctorSchedule(data[0])
                getDoctorActiveConsultations(data[0])
            }
            else {
                AdminService.getDoctor(state.doctorId)
                .then((data) => {
                    setSelectedDoctor(data.data)
                    getDoctorSchedule(data.data)
                    getDoctorActiveConsultations(data.data)
                })
            }
            
            
        })
        fetchPatients()
        .then((data) => {
            setPatients(data)
            if (!state.patientId) 
                setSelectedPatient(data[0])
            else {
                AdminService.getPatient(state.patientId)
                .then((data) => {
                    setSelectedPatient(data.data)
                })
            }
            
        })
    }, [])

    useEffect(() => {
        handleChange(selectedDoctor, 'doctor')
        handleChange(`Конференция ${selectedDoctor?.secondName} ${selectedDoctor?.firstName}`, 'title')
        handleChange(`Конференция. Врач: ${selectedDoctor?.secondName} ${selectedDoctor?.firstName}. Пациент: ${selectedPatient?.secondName} ${selectedPatient?.firstName}`, 'description')
    }, [selectedDoctor])

    useEffect(() => {
        handleChange(selectedPatient, 'patient')
        handleChange(`Конференция. Врач: ${selectedDoctor?.secondName} ${selectedDoctor?.firstName}. Пациент: ${selectedPatient?.secondName} ${selectedPatient?.firstName}`, 'description')
        
    }, [selectedPatient])

    useEffect(() => {
        if (selectedTime) 
            handleChange(selectedTime, 'start')
    }, [selectedTime])

    const handleChangeDoctor = (event, newValue) => {
        setSelectedDoctor(newValue)
        if (newValue) {
            getDoctorSchedule(newValue)
            getDoctorActiveConsultations(newValue)
            
        }
        
        
    }

    const handleChangePatient = (event, newValue) => {
        setSelectedPatient(newValue)
    }

    const getDoctorSchedule = async (doctor) => {
        if (dayjs(state.start).isBefore(dayjs(new Date()), 'date')) {
            setError('Невозмжно создать консультацию на прошедшую дату')
            return setGroupedSchedule([])
        }
        if (doctor.User.schedulerType = "dates" ) {
            let response = await SchedulerService.getDcotorScheduleDates(doctor.id, dayjs(state.start))
            const schedule = (response.data || []).map(slot => ({
                ...slot,
                start: dayjs(`${selectedDate.toISOString().split('T')[0]}T${slot.scheduleStartTime}`),
                end: dayjs(`${selectedDate.toISOString().split('T')[0]}T${slot.scheduleEndTime}`)

            }));
            let grouped = Object.groupBy(schedule, ({ WeekDay }) => WeekDay.name)
            setGroupedSchedule(sortSchedule(grouped))
            return
        }
        let response = await SchedulerService.getDcotorSchedule(doctor.id, (state.start).getDay())
        const schedule = (response.data || []).map(slot => ({
            ...slot,
            start: dayjs(`${selectedDate.toISOString().split('T')[0]}T${slot.scheduleStartTime}`),
            end: dayjs(`${selectedDate.toISOString().split('T')[0]}T${slot.scheduleEndTime}`)

        }));
        let grouped = Object.groupBy(schedule, ({ WeekDay }) => WeekDay.name)
        setGroupedSchedule(sortSchedule(grouped))
    }


    const isTimeUnavailable = (hour, minute = 0) => {
        return activeConsultations.some((consultation) => {
            const start = dayjs(consultation.slotStartDateTime);
            const end = dayjs(consultation.slotEndDateTime).subtract(2, 'minute');
            
            const timeToCheck = dayjs(selectedDate).hour(hour).minute(minute);
            return timeToCheck.isSame(start, 'minute')
        });
    };

    const isTimeInSchedule = (hour, minute = 0) => {
        return groupedSchedule[Object.keys(groupedSchedule)[0]].some(({ start, end }) => {
            // Преобразуем время начала и окончания в минуты с начала дня для сравнения
            const startTimeInMinutes = start.hour() * 60 + start.minute();
            const endTimeInMinutes = end.hour() * 60 + end.minute();
            const timeInMinutes = hour * 60 + minute;
            
            return timeInMinutes >= startTimeInMinutes && timeInMinutes < endTimeInMinutes;
        });
    };
    const handleChangeTime = (newValue) => {
        if (isTimeInSchedule(dayjs(newValue).hour(), dayjs(newValue).minute()) && !isTimeUnavailable(dayjs(newValue).hour(), dayjs(newValue).minute())) {
            setSelectedTime(newValue);
        }
    };

    const getDoctorActiveConsultations = async (doctor) => {
        const response = await DoctorService.getConsultations(doctor.User.id, state.start)
        setActiveConsultations(response.data[0])
    }

    const weekDaysOrder = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    const sortSchedule = (schedule) => {
        const sortedSchedule = Object.fromEntries(
            Object.entries(schedule)
              .sort(([dayA], [dayB]) => {
                const dayAIndex = weekDaysOrder.indexOf(dayA);
                const dayBIndex = weekDaysOrder.indexOf(dayB);
                return dayAIndex - dayBIndex;
              })
        );
        return sortedSchedule
    }

    var dateTimeOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        
    }
    function getDate(str) {
        var date = new Date(str);
        return date.toLocaleString('ru', dateTimeOptions)
    }

    function getTime (str) {
        let newTime = str.split(':')
        return `${newTime[0]}:${newTime[1]}`
    }

    return (
        <div>
            <div style={{ padding: "1rem" }}>
                <p>Создать консультацию на {getDate(selectedDate)}</p>
                {error ? <p style={{color: 'red', fontSize: '1rem'}}>{error}</p> : null}
                <Autocomplete
                    disablePortal
                    options={doctors}
                    sx={{ mb: 1.5 }}
                    renderInput={(params) => <TextField key={`doctor_${params.id}`} {...params} label="Врач" />}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.secondName + ' ' + option.firstName || ""}
                    value={selectedDoctor}
                    onChange={handleChangeDoctor}
                    inputValue={inputDoctorValue}
                    onInputChange={(event, newInputValue) => {
                        setInputDoctorValue(newInputValue);
                    }}
                />
                {Object.keys(groupedSchedule).length ?
                    <>
                        <div>
                            <p style={{marginBottom: '0.7rem'}}>Расписание врача на выбранный день: </p>
                            {Object.keys(groupedSchedule).length ?
                                Object.keys(groupedSchedule).map(function(key, index) {
                                    return <>
                                    <ol style={{listStyle: "none"}}>
                                        {groupedSchedule[key].map((s) => {
                                            return <li key={`schedule_${s.id}`} style={{paddingLeft: '1rem'}}>{getTime(s.scheduleStartTime)} - {getTime(s.scheduleEndTime)}<br></br></li> 
                                        })}
                                    </ol></>
                                    
                                })

                                : <p style={{color: 'red'}}>Нет доступных дней</p>
                            }                 
                        </div>
                        <div style={{marginTop: '2rem'}}>
                            <p style={{marginBottom: '0.5rem'}}>Занятое время и  даты: </p>
                            <ol style={{ listStyle: "none" }}>
                                {activeConsultations ? activeConsultations.map((c) => {
                                    return <li  key={`slots_${c.id}`} style={{paddingLeft: '1rem'}}>{getDate(c.slotStartDateTime)} - {getDate(c.slotEndDateTime)}<br></br></li>    
                                }) : 'Всё свободно'}
                            </ol>
                        </div>
                        <ThemeProvider theme={defaultTheme}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                <Stack 
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 2, sm: 1, md: 1 }} 
                                    sx={{mt: 2}}
                                >
                                    <DateField
                                        sx={{
                                            mb: 1,
                                            width: '100%'
                                        }}
                                        label="Выбранная дата"
                                        defaultValue={selectedDate}
                                        disabled={true}
                                        /* format="DD.MM.YYYY" */
                                    />
                                    <TimePicker
                                        sx={{
                                            mb: 1,
                                            width: '100%'
                                        }}
                                        skipDisabled={true}

                                        minutesStep={30}
                                        label="Выберите время начала"
                                        defaultValue={selectedDate}
                                        value={selectedTime}
                                        onChange={handleChangeTime}
                                        shouldDisableTime={(time, clockType) => {
                                            if (clockType === 'hours') {
                                                
                                                // Проверяем, доступен ли данный час
                                                return !isTimeInSchedule(dayjs(time).hour()) || isTimeUnavailable(dayjs(time).hour(), dayjs(time).minute());// `time` здесь - час
                                            }
                                            if (clockType === 'minutes') {
                                                // Проверяем, доступны ли указанные минуты в пределах уже выбранного часа
                                                const selectedHour = selectedTime ? selectedTime.getHours() : 0; // Убедитесь, что `selectedTime` определён
                                                return !isTimeInSchedule(dayjs(time).hour(), dayjs(time).minute()) || isTimeUnavailable(dayjs(time).hour(), dayjs(time).minute()); // `time` здесь - минуты
                                            }
                                            //return !isTimeInSchedule(dayjs(time).hour(), dayjs(time).minute()) || isTimeUnavailable(dayjs(time).hour(), dayjs(time).minute());
                                            return false;
                                        }}
                                    />
                                </Stack>
                                
                            </LocalizationProvider>
                        </ThemeProvider>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={duration}
                            disabled={true}
                            label="Длительность"
                            /* inputProps={{ readOnly: true }} */
                            sx={{ width: '100%', mt: 2 }}
                            onChange={handleChange}
                        >
                            <MenuItem key={1} value={'15'}>15 Минут</MenuItem>
                            <MenuItem key={2} value={'30'}>30 минут</MenuItem>
                            <MenuItem key={3} value={'60'}>Час</MenuItem>
                            
                        </Select>
                        <Autocomplete
                            disablePortal
                            options={patients}
                            sx={{ mt: 2 }}
                            renderInput={(params) => <TextField key={`doctor_${params.id}`} {...params} label="Пациент" />}
                            getOptionLabel={(option) => option.secondName + ' ' + option.firstName + ' (' + option.snils + ')' || ""}
                            value={selectedPatient}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={handleChangePatient}
                            inputValue={inputPatientValue}
                            onInputChange={(event, newInputValue) => {
                                setInputPatientValue(newInputValue);
                            }}
                        />
                        <p style={{fontSize: '0.8rem'}}>
                            Нет нужного пациента? {/* <a href={adminLocations.createPatient} target="_blank" rel="noopener noreferrer">Добавить</a> */}
                            <a onClick={handleOpen} style={{color: '#d30d15', cursor: 'pointer' }} rel="noopener noreferrer">Добавить</a>
                        </p>
                        {/* <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.slotStatusId || ""}
                            disabled={false}
                            label="Статус"
                            sx={{ width: '100%', mt: 2 }}
                            onChange={handleChangeStatus}
                        >
                            <MenuItem key={1} value={1}>Свободно</MenuItem>
                            <MenuItem key={4} value={4}>Завершено</MenuItem>
                            <MenuItem key={5} value={5}>Отменено</MenuItem>
                            
                        </Select> */}
                    </>
                    :
                    <p style={{color: 'red'}}>Нет доступного расписания</p>
                }
                
            </div>
            <PatientCreateModal show={open} onHide={() => setOpen(false)} />
            <DialogActions>
                <Button onClick={scheduler.close}>Отмена</Button>
                <Button onClick={handleSubmit}>Сохранить</Button>
            </DialogActions>
        </div>
    );
};

export default CustomEditor;