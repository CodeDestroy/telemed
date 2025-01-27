import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue, grey, red } from '@mui/material/colors';
import { format } from 'date-fns';
import Header from '../Header';
import {ru} from 'date-fns/locale/ru';
import DoctorService from '../../../Services/DoctorService';
import { Context } from '../../../';

const white = '#fff'
// Дни недели для отображения
const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

// Тема по умолчанию
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

const CreateSchedule = () => {

    const {store} = useContext(Context)
    const [schedule, setSchedule] = useState({
        Понедельник: [],
        Вторник: [],
        Среда: [],
        Четверг: [],
        Пятница: [],
        Суббота: [],
        Воскресенье: [],
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Понедельник');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [theme, setTheme] = useState(defaultTheme);

    // Открытие модального окна
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleShowSlot = async (startTime, endTime, selectedDay) => {
        try {
            if (startTime && endTime && selectedDay) {
                setSchedule({
                    ...schedule,
                    [selectedDay]: [...schedule[selectedDay], { start: startTime, end: endTime }],
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    // Добавление временного интервала
    const handleAddSlot = async () => {
        /* console.log(startTime, endTime, selectedDay, store.user.personId) */
        try {
            const response = await DoctorService.createScheduler(store.user.personId, selectedDay, startTime, endTime)
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

    // Удаление временного интервала
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

    useEffect(() => {
        async function fetchSchedule() {
            if (store.user?.personId) {
                const response = await DoctorService.getSchedule(store.user.personId);
                const newSchedule = { ...schedule };
    
                response.data.forEach(el => {
                    const day = el.WeekDay.name;
                    const start = el.scheduleStartTime.substring(0,5);
                    const end = el.scheduleEndTime.substring(0,5);
                    const id = el.id
                    
                    if (!newSchedule[day]) newSchedule[day] = [];
                    newSchedule[day].push({ start, end, id });
                });
    
                setSchedule(newSchedule);
            }
        }
        fetchSchedule();
    }, [store]);

    // Смена темы
    const toggleTheme = () => {
        const newTheme = createTheme({
        palette: {
            primary: {
                main: blue[theme.palette.primary.main === blue[700] ? 500 : 700],
            },
            secondary: {
                main: theme.palette.secondary.main === grey[50] ? grey[200] : grey[50],
            },
            background: {
                default: theme.palette.background.default === white ? grey[200] : white,
            },
        },
        });
        setTheme(newTheme);
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
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Ваше распиание
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>
                            Добавить время работы
                        </Button>
                        <Button variant="outlined" color="success" onClick={toggleTheme} sx={{ ml: 2 }}>
                            Сменить тему
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
        </>
        
    );
};

export default CreateSchedule;
