import { useEffect, useState, useContext } from 'react';
import Header from '../../Header';
import { Box, Button, Container, Grid, Typography, Modal, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Autocomplete } from '@mui/material';
import { Context } from '../../../../';
import DoctorService from '../../../../Services/DoctorService';
import AdminService from '../../../../Services/AdminService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CreateDateSchedule() {
    const { store } = useContext(Context);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [startDate, setStartDate] = useState(dayjs(new Date()));
    const [endDate, setEndDate] = useState(dayjs(new Date()).add(7, 'd'));
    const [schedule, setSchedule] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ date: null, startTime: null, endTime: null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await AdminService.getDoctors();
                if (response.status === 200) {
                    const arrayDoctors = response.data.map(doctor => ({ label: `${doctor.secondName} ${doctor.firstName}`, id: doctor.id }));
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
        if (!modalData.date || !modalData.startTime || !modalData.endTime) {
            alert('Заполните все поля');
            return;
        }
        if (!selectedDoctor) {
            alert('Выберите врача');
            return;
        }

        try {
            if (isEditing && editingSlot) {
                await DoctorService.updateSchedule(selectedDoctor.id, editingSlot.id, 
                    modalData.date.add(3, 'h'),
                    modalData.startTime.format('HH:mm'),
                    modalData.endTime.format('HH:mm'),
                );
                alert('Расписание обновлено');
            } else {
                /* console.log({
                    doctorId: selectedDoctor.id,
                    date: modalData.date,
                    startTime: modalData.startTime.format('HH:mm'),
                    endTime: modalData.endTime.format('HH:mm')
                }) */
                await DoctorService.addSchedule(
                    selectedDoctor.id,
                    modalData.date.add(3, 'h'),
                    modalData.startTime.format('HH:mm'),
                    modalData.endTime.format('HH:mm')
                );
                alert('Расписание добавлено');
            }
            setModalOpen(false);
            setIsEditing(false);
            setEditingSlot(null);
            handleFetchSchedule();
        } catch (e) {
            alert('Ошибка сохранения расписания \r' + e.response.data.error);
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
            endTime: dayjs(slot.scheduleEndTime, 'HH:mm')
        });
        console.log((slot.date))
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
        setModalData({ date: null, startTime: null, endTime: null }); 
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
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedule.map((slot) => (
                                            <TableRow key={slot.id}>
                                                <TableCell>{dayjs(slot.date).format('DD.MM.YYYY')}</TableCell>
                                                <TableCell>{slot.scheduleStartTime.substring(0,5)} - {slot.scheduleEndTime.substring(0,5)}</TableCell>
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
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddSlot}>Добавить расписание</Button>
                    </Box>
                </Container>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                        <Typography variant="h6">{isEditing ? 'Редактировать' : 'Добавить'} расписание</Typography>
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
                            minutesStep={30}
                            skipDisabled={true}
                        />
                        <TimePicker 
                            label="Время конца" 
                            value={modalData.endTime} 
                            onChange={(time) => setModalData({ ...modalData, endTime: time })} 
                            fullWidth 
                            sx={{ mb: 2, width: '100%' }} 
                            minTime={dayjs('07:30:00', 'HH:mm:ss')}
                            maxTime={dayjs('23:30:00', 'HH:mm:ss')}
                            minutesStep={30}
                            skipDisabled={true}
                        />
                        <Button variant="contained" fullWidth onClick={handleAddSchedule}>{isEditing ? 'Сохранить' : 'Добавить'}</Button>
                    </Box>
                </Modal>
            </LocalizationProvider>
        </>
    );
}

export default CreateDateSchedule;