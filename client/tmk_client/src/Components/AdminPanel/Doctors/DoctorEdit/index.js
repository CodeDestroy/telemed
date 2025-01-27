import React, { useEffect, useContext, useState } from 'react';
import { Container, TextField, Button, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import SubMenu from '../../../SubMenu';
import menuItems from '../../../SubMenu/AdminPatientManagmentSub';
import { Context } from '../../../..';
import AdminService from '../../../../Services/AdminService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
/* import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import LoadingScreen from '../../../Loading';
import adminLocations from '../../../../Locations/AdminLocations';
import SchedulerService from '../../../../Services/SchedulerService'
import {
    Grid,
    Typography,
    Modal,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,

} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import DoctorService from '../../../../Services/DoctorService';
import { blue, grey, red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import AddIcon from '@mui/icons-material/Add';
import {ru} from 'date-fns/locale/ru';
import { format } from 'date-fns';
const white = '#fff'
const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
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
  
const DoctorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [doctor, setDoctor] = useState(null);
    const [schedule, setSchedule] = useState({
        Понедельник: [],
        Вторник: [],
        Среда: [],
        Четверг: [],
        Пятница: [],
        Суббота: [],
        Воскресенье: [],
    });
    const [selectedDay, setSelectedDay] = useState('Понедельник');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [theme, setTheme] = useState(defaultTheme);
    const [error, setError] = useState(null)
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSave = async () => {

        try {
            const response = await AdminService.editDoctor(id, doctor)

            if (response.status == 200) {
                window.location = adminLocations.doctorManagement
            }
            else {
                setError(response.data.message)
            }
        }
        catch (e) {
            setError(e.response.data.message)
        }
      // Здесь должна быть логика сохранения изменений
        /* navigate('/doctors'); */
    };

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchDoctor() {
                try {
                    const response = await AdminService.getDoctor(id)
                    /* let array = response.data */

                    setDoctor(response.data);
                    /* console.log(response.data) */
                    const scheduleResponse = await SchedulerService.getDcotorSchedule(id)
                    const newSchedule = { ...schedule };
                    scheduleResponse.data.forEach(el => {
                        const day = el.WeekDay.name;
                        const start = el.scheduleStartTime.substring(0,5);
                        const end = el.scheduleEndTime.substring(0,5);
                        const id = el.id
                        
                        if (!newSchedule[day]) newSchedule[day] = [];
                        newSchedule[day].push({ start, end, id });
                    });
        
                    setSchedule(newSchedule);

                } catch (e) {
                    console.log(e);
                }
            }
            fetchDoctor();
        }
    }, [store]);

    const setBirthDate = (event) => {
        setDoctor({...doctor, birthDate: event.target.value });
    }
    const setName = (event) => {
        setDoctor({...doctor, firstName: event.target.value });
    }
    const setSecondName = (event) => {
        setDoctor({...doctor, secondName: event.target.value });
    }
    const setPatronomicName = (event) => {
        setDoctor({...doctor, 'patronomicName': event.target.value });
    }
    const handleSnilsChange = (event) => {
        setDoctor({...doctor, snils: event.target.value });
    }
    const handleConfirmed = (event) => {
        setDoctor({...doctor, User: { 
           ...doctor.User, 
           confirmed: !doctor.User.confirmed
        }})
    }
    const setPhone = (event) => {
        console.log(event.target)
        setDoctor({...doctor, User: { 
            ...doctor.User, 
            phone: event.target.value
        }})
    }
    const setEmail = (event) => {
        setDoctor({...doctor, User: { 
            ...doctor.User, 
            email: event.target.value
        }})
    }

    const handleDeleteSlot = async (day, index) => {
        try {
            const response = await DoctorService.deleteSchedule(schedule[day][index].id)
            if (response.status == 200) {
                console.log(day, schedule[day][index])
                setSchedule({
                    ...schedule,
                    [day]: schedule[day].filter((_, i) => i !== index),
                });
            }
        }
        catch (e) {
            console.log(e.response.data.error)
        }
        
    };
    
    // Добавление временного интервала
    const handleAddSlot = async () => {
        /* console.log(startTime, endTime, selectedDay, store.user.personId) */
        try {
            const response = await DoctorService.createScheduler(doctor.id, selectedDay, startTime, endTime)
            /* const response = {status: 201} */
            if (response.status == 201) {
                if (startTime && endTime && selectedDay) {
                    setSchedule({
                        ...schedule,
                        [selectedDay]: [...schedule[selectedDay], { start: format(startTime, 'HH:mm'), end: format(endTime, 'HH:mm'), id: response.data.id }],
                    });
                    /* await handleShowSlot(format(startTime, 'HH:mm'), format(endTime, 'HH:mm'), selectedDay) */
                }
                handleCloseModal();
            }
            else {
                alert('Ошибка')
            }
        }
        catch (e) {
            alert(e.response.data.error)
        }
        
        
        
    };

    const minDate = new Date();
    minDate.setHours(8);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);

    const maxDate = new Date();
/*     maxDate.setDate(maxDate); */
    maxDate.setHours(21);
    maxDate.setMinutes(1);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);
return (
    <>
        <Header/>
        {/* <SubMenu menuItems={menuItems} /> */}
        {doctor ?
            <Container>
                <h2 style={{margin: '2rem 0'}}>Редактировать врача {doctor.secondName} {doctor.firstName}</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {error?.length > 0 && error ? <h4 style={{color: 'red'}}>{error}</h4> : ''}
                        <TextField label="Фамилия" variant="outlined" fullWidth value={doctor.secondName} onChange={setName}/>
                        <TextField label="Имя" variant="outlined" fullWidth value={doctor.firstName} onChange={setSecondName}/>
                        <TextField label="Отчество" variant="outlined" fullWidth value={doctor.patronomicName} onChange={setPatronomicName}/>
                        {/* <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <DatePicker
                                label="Дата рождения"
                                value={patient.birthDate}
                                onChange={(event) => setBirthDate(event)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider> */}
                        <TextField label="Телефон" variant="outlined" fullWidth value={doctor.User.phone} onChange={setPhone}/>
                        <TextField label="СНИЛС" variant="outlined" fullWidth value={doctor.snils} onChange={handleSnilsChange}/>
                        <TextField label="Email" variant="outlined" fullWidth value={doctor.User.email} onChange={setEmail}/>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={doctor.User.confirmed}
                                    onChange={handleConfirmed}
                                    inputProps={{ 'aria-label': 'controlled' }} 
                                />
                            } 
                                label="Подтверждён" />
                        </FormGroup>

                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Сохранить
                        </Button>
                </Box>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <Box sx={{ p: 4 }}>
                            <Typography variant="h4" align="center" gutterBottom>
                                Ваше распиание
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>
                                Добавить время работы
                            </Button>

                            <Grid container spacing={2} sx={{ mt: 4 }}>
                                {daysOfWeek.map((day) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
                                        <Box
                                            sx={{
                                                backgroundColor: theme.palette.secondary.main,
                                                p: 2,
                                                borderRadius: '8px',
                                                height: '200px',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                {day}
                                            </Typography>
                                            {schedule[day].map((slot, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        p: 1,
                                                        backgroundColor: theme.palette.primary.main,
                                                        borderRadius: '4px',
                                                }}
                                                >
                                                <Typography>
                                                    {slot.start} - {slot.end}
                                                </Typography>
                                                <IconButton onClick={() => handleDeleteSlot(day, index)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                        {/* Модальное окно для добавления временных интервалов */}
                            <Modal open={modalOpen} onClose={handleCloseModal}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 400,
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Добавить время работы
                                    </Typography>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel id="day-select-label">День недели</InputLabel>
                                        <Select
                                            labelId="day-select-label"
                                            value={selectedDay}
                                            onChange={(e) => setSelectedDay(e.target.value)}
                                        >
                                        {daysOfWeek.map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" gutterBottom>
                                            Время начала:
                                        </Typography>
                                        <TimePicker
                                            value={startTime}
                                            onChange={setStartTime}
                                            minutesStep={30}
                                            minTime={minDate}
                                            maxTime={maxDate}
                                            sx={{width: '100%'}}
                                            skipDisabled={true}
                                            /* renderInput={(params) => <TextField {...params} />} */
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" gutterBottom>
                                            Время конца:
                                        </Typography>
                                        <TimePicker
                                            value={endTime}
                                            onChange={setEndTime}
                                            minutesStep={30}
                                            minTime={minDate}
                                            maxTime={maxDate}
                                            sx={{width: '100%'}}
                                            skipDisabled={true}
                                            /* renderInput={(params) => <TextField {...params} />} */
                                        />
                                    </Box>
                                    <Button variant="contained" color="primary" fullWidth onClick={handleAddSlot}>
                                        Добавить
                                    </Button>
                                </Box>
                            </Modal>
                        </Box>
                    </LocalizationProvider>
                </ThemeProvider>
            </Container>
            
        :
        <LoadingScreen/>
        }
    </>
    
);
};

export default DoctorEdit;
