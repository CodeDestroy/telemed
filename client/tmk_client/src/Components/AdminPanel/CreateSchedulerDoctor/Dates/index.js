import { useEffect, useState, useContext } from 'react';
import Header from '../../Header';
import {
    Box, Button, Container, Grid, Typography, Modal, TextField,
    IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from '@mui/material';

import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { Context } from '../../../../';
import DoctorService from '../../../../Services/DoctorService';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import { Autocomplete } from '@mui/material';

// Типы консультаций (как в admin-версии)
const consultationTypes = [
    { label: 'ТМК', durationOptions: ['25', '50'], serviceId: 1 },
    { label: 'Второе мнение', durationOptions: ['10', '15'], serviceId: 2 },
];

function CreateDateScheduleDoctor() {
    const { store } = useContext(Context);
    const doctorId = store.selectedProfile?.id;

    const [startDate, setStartDate] = useState(dayjs(new Date()));
    const [endDate, setEndDate] = useState(dayjs(new Date()).add(7, 'd'));
    const [schedule, setSchedule] = useState([]);
    const [slotBreak, setSlotBreak] = useState(5);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        date: dayjs(new Date()),
        startTime: null,
        endTime: null,
        price: 0,
        isFree: false,
        slotDuration: '',
        slotsCount: 1,
        consultationType: '',
    });

    const [previousPrice, setPreviousPrice] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    const handleFetchSchedule = async () => {
        if (!doctorId) return;

        try {
            const response = await DoctorService.getScheduleByDates(doctorId, startDate, endDate);
            setSchedule(response.data);
        } catch (e) {
            alert("Ошибка загрузки расписания");
        }
    };

    useEffect(() => {
        if (doctorId) handleFetchSchedule();
    }, [doctorId, startDate, endDate]);

    const handleAddSchedule = async () => {
        if (!modalData.date || !modalData.startTime || !modalData.consultationType || !modalData.slotDuration) {
            alert("Заполните все обязательные поля");
            return;
        }

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
            // Редактирование одного слота
            if (isEditing && editingSlot) {
                await DoctorService.updateSchedule(
                    doctorId,
                    editingSlot.id,
                    modalData.date.add(3, 'h'),
                    modalData.startTime.format("HH:mm"),
                    modalData.endTime.format("HH:mm"),
                    modalData.price,
                    modalData.isFree
                );
            } 
            // Добавление нескольких слотов
            else {
                for (const slot of totalSlots) {
                    console.log(slot)
                    await DoctorService.addSchedule(
                        doctorId,
                        slot.date,
                        slot.scheduleStartTime,
                        slot.scheduleEndTime,
                        slot.price,
                        slot.isFree,
                        slot.slotDuration,
                        1,
                        slot.serviceId
                    );
                }
            }

            alert("Сохранено!");
            setModalOpen(false);
            setIsEditing(false);
            setEditingSlot(null);
            handleFetchSchedule();

        } catch (e) {
            alert("Ошибка сохранения: " + (e.response?.data?.error || e.message));
        }
    };

    const handleEditSlot = (slot) => {
        setModalData({
            date: dayjs(slot.date),
            startTime: dayjs(slot.scheduleStartTime, "HH:mm"),
            endTime: dayjs(slot.scheduleEndTime, "HH:mm"),
            price: slot.SchedulePrices[0]?.price ?? 0,
            isFree: slot.SchedulePrices[0]?.isFree ?? false,
            slotDuration: slot.SchedulePrices[0]?.slotDuration ?? '',
            slotsCount: 1,
            consultationType: slot.Service?.serviceShortName ?? ''
        });

        setIsEditing(true);
        setEditingSlot(slot);
        setModalOpen(true);
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            await DoctorService.deleteSchedule(slotId);
            handleFetchSchedule();
        } catch (e) {
            alert("Ошибка удаления");
        }
    };

    const handleChangeFreeAppointment = (event) => {
        if (event.target.checked) {
            setPreviousPrice(modalData.price);
            setModalData({ ...modalData, price: 0, isFree: true });
        } else {
            setModalData({ ...modalData, price: previousPrice, isFree: false });
            setPreviousPrice(0);
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
                <Container maxWidth="md" className="mt-5">
                    <Grid container spacing={2}>
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
                                        {schedule.map(slot => (
                                            <TableRow key={slot.id}>
                                                <TableCell>{dayjs(slot.date).format("DD.MM.YYYY")}</TableCell>
                                                <TableCell>{slot.scheduleStartTime} - {slot.scheduleEndTime}</TableCell>
                                                <TableCell>{slot.SchedulePrices[0]?.price} ₽</TableCell>
                                                <TableCell>{slot.Service?.serviceShortName ?? ""}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleEditSlot(slot)}><EditIcon /></IconButton>
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

                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => {
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
                        }}>
                            Добавить расписание
                        </Button>
                    </Box>
                </Container>

                {/* МОДАЛЬНОЕ ОКНО */}
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 420, bgcolor: 'background.paper',
                        boxShadow: 24, p: 4, borderRadius: 2
                    }}>

                        <Typography variant="h6">{isEditing ? "Редактировать" : "Добавить"} расписание</Typography>

                        {/* Тип консультации */}
                        <Autocomplete
                            value={modalData.consultationType}
                            onChange={(e, v) => setModalData({ ...modalData, consultationType: v, slotDuration: '' })}
                            options={consultationTypes.map(t => t.label)}
                            renderInput={(params) => <TextField {...params} label="Тип консультации" />}
                            sx={{ mb: 2, width: "100%" }}
                        />

                        {/* Длительность */}
                        {modalData.consultationType &&
                            <Autocomplete
                                value={modalData.slotDuration}
                                onChange={(e, v) => setModalData({ ...modalData, slotDuration: v })}
                                options={consultationTypes.find(t => t.label === modalData.consultationType)?.durationOptions || []}
                                renderInput={(params) => <TextField {...params} label="Длительность (мин)" />}
                                sx={{ mb: 2, width: "100%" }}
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
                            sx={{ mb: 2, width: "100%" }}
                        />

                        <TimePicker
                            label="Время начала"
                            value={modalData.startTime}
                            onChange={(time) => setModalData({ ...modalData, startTime: time })}
                            fullWidth 
                            sx={{ mb: 2, width: "100%" }}
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

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Цена</InputLabel>
                            <OutlinedInput
                                value={modalData.price}
                                onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                                endAdornment={<InputAdornment position="end">₽</InputAdornment>}
                                label="Цена"
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Количество слотов</InputLabel>
                            <OutlinedInput
                                value={modalData.slotsCount}
                                onChange={(e) => setModalData({ ...modalData, slotsCount: Number(e.target.value) })}
                                label="Количество слотов"
                            />
                        </FormControl>

                        <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={modalData.isFree} onChange={handleChangeFreeAppointment} />
                                }
                                label="Бесплатно"
                            />
                        </FormGroup>

                        <Button variant="contained" fullWidth onClick={handleAddSchedule}>
                            {isEditing ? "Сохранить" : "Добавить"}
                        </Button>

                    </Box>
                </Modal>
            </LocalizationProvider>
        </>
    );
}

export default CreateDateScheduleDoctor;
