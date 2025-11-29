import { useEffect, useState, useContext } from 'react';
import Header from '../../Header';
import { Box, Button, Container, Grid, Typography, Modal, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Autocomplete } from '@mui/material';
import { Context } from '../../../../';
import DoctorService from '../../../../Services/DoctorService';
import AdminService from '../../../../Services/AdminService';
import DeleteIcon from '@mui/icons-material/Delete';

import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

// Определяем типы консультаций и соответствующие длительности
const consultationTypes = [
    { label: 'ТМК', durationOptions: ['25', '50'], serviceId: 1 },
    { label: 'Второе мнение', durationOptions: ['10', '15'], serviceId: 2 },
];

function CreateDateSchedule() {
    const { store } = useContext(Context);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [startDate, setStartDate] = useState(dayjs(new Date()));
    const [endDate, setEndDate] = useState(dayjs(new Date()).add(7, 'd'));
    const [schedule, setSchedule] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        date: dayjs(new Date()),
        startTime: null,
        endTime: null,
        price: null,
        isFree: false,
        slotDuration: '',
        slotsCount: 1,
        consultationType: '', // Тип консультации
    });
    const [previousPrice, setPreviousPrice] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [slotBreak, setSlotBreak] = useState(5);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info" // success | error | warning | info
    });

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };



    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await AdminService.getDoctors(store.selectedProfile.id);
                if (response.status === 200) {
                    const arrayDoctors = response.data.map(doctor => ({
                        label: `${doctor.secondName} ${doctor.firstName}`,
                        id: doctor.id
                    }));
                    setDoctors(arrayDoctors);
                } else {
                    alert('Ошибка загрузки врачей');
                }
            } catch (e) {
                alert('Ошибка загрузки списка врачей');
            }
        }
        fetchDoctors();
    }, []);

    const handleFetchSchedule = async () => {
        if (!selectedDoctor /* || !startDate || !endDate */) {
            alert('Выберите врача и даты');
            return;
        }
        try {
            const response = await DoctorService.getScheduleByDates(selectedDoctor.id, startDate, endDate);
            setSchedule(response.data);
        } catch (e) {
            alert('Ошибка загрузки расписания');
        }
    };

    const handleAddSchedule = async () => {
        if (!modalData.date || !modalData.startTime || !modalData.consultationType || !modalData.slotDuration) {
            alert('Заполните все обязательные поля');
            return;
        }
        if (!selectedDoctor) {
            alert('Выберите врача');
            return;
        }
        // Разбираем длительность слота и перерыв
        const slotDurationMinutes = parseInt(modalData.slotDuration.split(' ')[0]);
        const breakMinutes = slotBreak || 0;
    
        let totalSlots = [];
        for (let i = 0; i < modalData.slotsCount; i++) {
            // Для каждого слота прибавляем (длительность + перерыв) к начальному времени
            const currentStartTime = dayjs(modalData.startTime).add(i * (slotDurationMinutes + breakMinutes), 'minute');
            const currentEndTime = currentStartTime.add(slotDurationMinutes, 'minute');

            totalSlots.push({
                date: modalData.date.format('YYYY-MM-DD'),
                scheduleStartTime: currentStartTime.format('HH:mm'),
                scheduleEndTime: currentEndTime.format('HH:mm'),
                price: modalData.price,
                isFree: modalData.isFree,
                slotDuration: modalData.slotDuration,
                serviceId: consultationTypes.find(type => type.label === modalData.consultationType)?.serviceId
            });
        }

        try {
            if (isEditing && editingSlot) {
                await DoctorService.updateSchedule(selectedDoctor.id, editingSlot.id, 
                    modalData.date.add(3, 'h'), 
                    modalData.startTime.format('HH:mm'), 
                    modalData.endTime.format('HH:mm'), 
                    modalData.price, 
                    modalData.isFree,
                );
                alert('Расписание обновлено');
            } else {
                const successful = [];
                const failed = [];

                for (const slot of totalSlots) {
                    try {
                        await DoctorService.addSchedule(
                            selectedDoctor.id,
                            slot.date,
                            slot.scheduleStartTime,
                            slot.scheduleEndTime,
                            slot.price,
                            slot.isFree,
                            slot.slotDuration,
                            1,
                            slot.serviceId
                        );

                        successful.push(`${slot.scheduleStartTime}-${slot.scheduleEndTime}`);
                    } catch (e) {
                        failed.push(`${slot.scheduleStartTime}-${slot.scheduleEndTime}`);
                    }
                }

                let message = "";

                if (successful.length > 0) {
                    message += `Добавлены слоты:\n${successful.join('\n')}\n\n`;
                }
                if (failed.length > 0) {
                    message += `Не добавлены (пересекаются по времени с другими слотами врача):\n${failed.join('\n')}`;
                }

                showSnackbar(message || "Нет добавленных слотов", failed.length > 0 ? "warning" : "success");

                /* setModalOpen(false);
                setIsEditing(false);
                setEditingSlot(null); */
                handleFetchSchedule();

            }
            setModalOpen(false);
            setIsEditing(false);
            setEditingSlot(null);
            handleFetchSchedule();
        } catch (e) {
            alert('Ошибка сохранения расписания \n' + e.response?.data?.error || e.message);
        }
    };

    const handleEditSlot = (slot) => {
        if (!selectedDoctor) {
            alert('Выберите врача');
            return;
        }
        setModalData({
            date: dayjs(slot.date),
            startTime: dayjs(slot.scheduleStartTime, 'HH:mm'),
            endTime: dayjs(slot.scheduleEndTime, 'HH:mm'),
            price: slot.SchedulePrices[0]?.price ?? 0,
            isFree: slot.SchedulePrices[0]?.isFree ?? false,
            slotDuration: slot.SchedulePrices[0]?.slotDuration ?? '',
            consultationType: '', // По умолчанию пустой выбор типа консультации
        });
        setIsEditing(true);
        setEditingSlot(slot);
        setModalOpen(true);
    };

    const handleAddSlot = () => {
        if (!selectedDoctor) {
            alert('Выберите врача');
            return;
        }
        setIsEditing(false); 
        setModalData({ 
            date: null, 
            startTime: null, 
            endTime: null, 
            price: 0, 
            isFree: false, 
            slotDuration: '', 
            slotsCount: 1,
            consultationType: '' 
        }); 
        setModalOpen(true); 
    }

    const handleDeleteSlot = async (slotId) => {
        try {
            await DoctorService.deleteSchedule(slotId);
            alert('Расписание удалено');
            handleFetchSchedule();
        } catch (e) {
            alert('Ошибка удаления расписания');
        }
    };

    const handleChangeFreeAppointment = (event) => {
        if (event.target.checked) {
            setPreviousPrice(modalData.price);
            setModalData({ ...modalData, price: 0, isFree: true });
        } else {
            if (previousPrice) {
                setModalData({ ...modalData, price: previousPrice, isFree: false });
                setPreviousPrice(0);
            }
        }
    };

    const calculateEndTime = () => {
        if (!modalData.startTime || !modalData.slotDuration || !modalData.slotsCount) return "";

        const start = dayjs(modalData.startTime);
        const duration = parseInt(modalData.slotDuration.split(' ')[0]); // длительность слота в минутах
        const breakMinutes = slotBreak || 0;

        // Общая длительность = (длительность слота + перерыв) * количество слотов, но перерыв после последнего слота не нужен
        const totalMinutes = modalData.slotsCount * (duration + breakMinutes) - breakMinutes;

        return start.add(totalMinutes, "minute").format("HH:mm");
    };

    return (
        <>
            <Header />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <Container maxWidth="md" className='mt-5'>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Autocomplete
                                value={selectedDoctor}
                                onChange={(event, newValue) => setSelectedDoctor(newValue)}
                                options={doctors}
                                renderInput={(params) => <TextField {...params} label="Врач" />}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DatePicker label="Дата начала" value={startDate} onChange={setStartDate} format="DD.MM.YYYY" />
                        </Grid>
                        <Grid item xs={3}>
                            <DatePicker label="Дата конца" value={endDate} onChange={setEndDate} format="DD.MM.YYYY" />
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" onClick={handleFetchSchedule}>Загрузить</Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Расписание</Typography>
                        {schedule.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата</TableCell>
                                            <TableCell>Время</TableCell>
                                            <TableCell>Цена</TableCell>
                                            <TableCell>Тип</TableCell>
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedule.map((slot) => (
                                            <TableRow key={slot.id}>
                                                <TableCell>{dayjs(slot.date).format('DD.MM.YYYY')}</TableCell>
                                                <TableCell>{slot.scheduleStartTime.substring(0,5)} - {slot.scheduleEndTime.substring(0,5)}</TableCell>
                                                <TableCell>{slot.SchedulePrices[0].price}</TableCell>
                                                <TableCell>{slot.Service?.serviceShortName ?? ''}</TableCell>
                                                <TableCell>
                                                    {/* <IconButton onClick={() => handleEditSlot(slot)}><EditIcon /></IconButton> */}
                                                    <IconButton onClick={() => handleDeleteSlot(slot.id)}><DeleteIcon /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>Нет доступных слотов</Typography>
                        )}
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddSlot}>Добавить расписание</Button>
                    </Box>
                </Container>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6">{isEditing ? 'Редактировать' : 'Добавить'} расписание</Typography>
                        
                        {/* Выбор типа консультации */}
                        <Autocomplete
                            value={modalData.consultationType}
                            onChange={(event, newValue) => {
                                setModalData(prevState => ({
                                    ...prevState,
                                    consultationType: newValue,
                                    slotDuration: ''
                                }));
                            }}
                            options={consultationTypes.map(type => type.label)}
                            renderInput={(params) => <TextField {...params} label="Тип консультации" />}
                            style={{ marginBottom: '8px', width: '100%' }}
                        />

                        {/* Поле выбора длительности консультации */}
                        {modalData.consultationType &&
                            <Autocomplete
                                value={modalData.slotDuration}
                                onChange={(event, newValue) => setModalData({...modalData, slotDuration: newValue})}
                                options={consultationTypes.find(type => type.label === modalData.consultationType)?.durationOptions || []}
                                renderInput={(params) => <TextField {...params} label="Продолжительность приема" />}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                        }
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="break-label">Перерыв между слотами</InputLabel>

                            <Select
                                labelId="break-label"
                                value={slotBreak}
                                label="Перерыв между слотами"
                                onChange={(e) => setSlotBreak(e.target.value)}
                            >
                                <MenuItem value={0}>0 минут</MenuItem>
                                <MenuItem value={5}>5 минут</MenuItem>
                                <MenuItem value={10}>10 минут</MenuItem>
                                <MenuItem value={15}>15 минут</MenuItem>
                                <MenuItem value={20}>20 минут</MenuItem>
                            </Select>
                        </FormControl>



                        <DatePicker 
                            label="Дата" 
                            value={modalData.date} 
                            onChange={(date) => setModalData({ ...modalData, date })}
                            format="DD.MM.YYYY" 
                            fullWidth 
                            sx={{ mb: 2, width: '100%' }} 
                        />
                        <TimePicker 
                            label="Время начала" 
                            value={modalData.startTime} 
                            onChange={(time) => setModalData({ ...modalData, startTime: time })}
                            fullWidth 
                            sx={{ mb: 2, width: '100%' }} 
                            minTime={dayjs('07:00:00', 'HH:mm:ss')}
                            maxTime={dayjs('23:00:00', 'HH:mm:ss')}
                            minutesStep={10}
                            skipDisabled={true}
                        />
                        {/* Автоматический расчёт времени конца */}
                        {modalData.startTime && modalData.slotDuration &&
                            <TextField
                                label="Время окончания приёма"
                                value={calculateEndTime()}
                                disabled
                                sx={{ mb: 2, width: "100%" }}
                            />
                        }
                        <FormControl fullWidth sx={{ mb: 2, width: '100%' }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Цена приема</InputLabel>
                            <OutlinedInput
                                value={modalData.price}
                                onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                                id="outlined-adornment-amount"
                                endAdornment={<InputAdornment position="end">₽</InputAdornment>}
                                label="Цена приема"
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2, width: '100%' }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Количество слотов</InputLabel>
                            <OutlinedInput
                                value={modalData.slotsCount}
                                onChange={(e) => setModalData({ ...modalData, slotsCount: Number(e.target.value) })}
                                id="outlined-adornment-amount"
                                label="Количество слотов"
                            />
                        </FormControl>
                        <FormGroup sx={{ mb: 2, width: '100%' }}>
                            <FormControlLabel 
                                control={
                                    <Checkbox 
                                        checked={modalData.isFree}
                                        onChange={handleChangeFreeAppointment}
                                        inputProps={{ 'aria-label': 'controlled' }} 
                                    />
                                } 
                                label="Бесплатная консультация" 
                            />
                        </FormGroup>
                        <Button variant="contained" fullWidth onClick={handleAddSchedule}>{isEditing ? 'Сохранить' : 'Добавить'}</Button>
                        
                    </Box>

                </Modal>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setSnackbar({...snackbar, open: false})} 
                        severity={snackbar.severity}
                        sx={{ whiteSpace: 'pre-line' }} // важно! чтобы переносы строк работали
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </LocalizationProvider>
        </>
    );
}

export default CreateDateSchedule;