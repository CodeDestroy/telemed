import { useEffect, useState, useContext } from 'react';
import {
  Backdrop,
  Autocomplete,
  TextField,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import dayjs from 'dayjs';
import { Context } from '../../../..';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ru } from 'date-fns/locale';
import AdminService from '../../../../Services/AdminService';
import DoctorService from '../../../../Services/DoctorService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '0.5rem',
  boxShadow: 24,
  p: 4,
};

const slotStatuses = [
  { value: 2, label: 'Ждёт оплаты' },
  { value: 3, label: 'Оплачено' },
  { value: 4, label: 'Завершено' },
  { value: 5, label: 'Отменено' },
];

const EditSlotModal = ({ open, onClose, item }) => {
  const { store } = useContext(Context);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedule, setschedule] = useState([]);
  const [slot, setSlot] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedScheduleId, setselectedScheduleId] = useState(null);
  const [status, setStatus] = useState(1);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);
  let addItemSchedule = true
  /* const [addItemSchedule, setAddItemSchedule] = useState(true) */
  // Загрузка пациентов
  const fetchPatients = async () => {
    const res = await AdminService.getPatients();
    setPatients(res.data);
  };

  // Загрузка врачей
  const fetchDoctors = async () => {
    const res = await AdminService.getDoctors(store.selectedProfile.id);
    setDoctors(res.data);
  };

  const fetchSlot = async (slotId) => {
    try {
      const res = await AdminService.getSlotById(slotId)
      setSlot(res.data)
    }
    catch (e) {
      console.error(e);
    }
  }

  const fetchScheduleById = async (scheduleId) => {
    try {
      const res = await DoctorService.getScheduleById(scheduleId);
      return res.data
    }
    catch (e) {
      console.error(e);
    }
  }

  // Загрузка слотов
  const fetchSchedule = async (doctorId, serviceId, date) => {
    if (!doctorId || !serviceId || !date) return;

    try {
      const res = await DoctorService.getScheduleByDateV2(
        doctorId,
        dayjs(date).format('YYYY-MM-DD'),
        serviceId
      );
      const filteredschedule = res.data.filter(s => s.scheduleServiceTypeId === serviceId);
      if (addItemSchedule) {
        const currSchedule = await fetchScheduleById(item.id)
        filteredschedule.push(currSchedule)
        if (filteredschedule)
          setselectedScheduleId(currSchedule.id);
        else 
          setselectedScheduleId(null);
      }
      console.log(filteredschedule)
      setschedule(filteredschedule);
      
      // Если открыли модалку для редактирования, выбираем текущий слот
      
    } catch (e) {
      console.error(e);
    }
  };

  

  // Инициализация при открытии модалки
  useEffect(() => {
    if (open && item) {
      fetchSlot(item.slotId)
      fetchPatients();
      fetchDoctors();
      setSelectedPatient(item.patient || null);
      setSelectedDoctor(item.doctor || null);
      setDate(new Date(item.date));

      if (item.doctorId && item.Service?.id && item.date) {
        fetchSchedule(item.doctorId, item.Service.id, item.date);
      }
    }
  }, [open, item]);

  // Сабмит с выбранным slotId
  const handleSubmit = async () => {
    if (!selectedScheduleId) {
      setError('Выберите слот');
      return;
    }
    try {
      
      const response = await AdminService.editSlotV2(
        item.slotId, // передаем id выбранного слота
        selectedDoctor,
        selectedPatient,
        selectedScheduleId,
        status
      );
      if (response.status === 200) {
        alert('Изменения сохранены');
        window.location.reload();
      } else {
        setError('Ошибка при сохранении, попробуйте снова');
      }
    } catch (error) {
      console.error(error);
      setError('Произошла ошибка при отправке данных');
    }
  };

  // После загрузки пациентов
  useEffect(() => {
    if (patients.length && slot?.Patient.id) {
      const patient = patients.find(p => p.id == slot?.Patient.id);
      if (patient) setSelectedPatient(patient);
    }
  }, [patients, slot]);

  // После загрузки врачей
  useEffect(() => {
    if (doctors.length && slot?.Doctor.id) {
      const doctor = doctors.find(d => d.id === slot?.Doctor.id);
      if (doctor) setSelectedDoctor(doctor);
    }
  }, [doctors, slot]);

  useEffect(() => {
    if (slotStatuses.length && slot?.slotStatusId) {
      const status = slotStatuses.find(s => s.value === slot?.slotStatusId);
      if (status) setStatus(slot.slotStatusId);
    }
  }, [slotStatuses, slot]);


  useEffect(() => {
    if (selectedDoctor && item) {
      // Сбрасываем старое расписание и выбранный слот
      setschedule([]);
      setselectedScheduleId(null);
      if (selectedDoctor.id != item.doctorId)
        addItemSchedule = false
      else 
        addItemSchedule = true
      // Загружаем новое расписание
      fetchSchedule(selectedDoctor.id, item.Service.id, item.date);
    }
  }, [selectedDoctor, item]);

  
      

  // После загрузки слотов
/*   useEffect(() => {
    if (schedule.length && item?.slotId) {
      const slot = schedule.find(s => s.slotId === item.slotId || s.id === item.slotId);
      if (slot) setselectedScheduleId(slot.id);
    }
  }, [schedule, item]); */


  if (!open || !item) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {error && <Typography color="error">{error}</Typography>}
          <Typography variant="h5" gutterBottom>Редактировать консультацию</Typography>

          {/* Врач */}
          <Autocomplete
            disablePortal
            options={doctors}
            value={selectedDoctor || null} // берём объект из списка
            onChange={(e, newValue) => setSelectedDoctor(newValue)}
            getOptionLabel={o => o ? `${o.secondName} ${o.firstName} ${o.patronomicName}` : ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id} // сравнение по id
            renderInput={params => <TextField {...params} label="Врач" />}
            sx={{ mt: 2 }}
          />

          {/* Пациент */}
          <Autocomplete
            disabled
            disablePortal
            options={patients}
            value={selectedPatient || null} // берём объект из списка
            onChange={(e, newValue) => setSelectedPatient(newValue)}
            getOptionLabel={o => o ? `${o.secondName} ${o.firstName} ${o.patronomicName} +${(o.User.phone)}` : ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id} // сравнение по id
            renderInput={params => <TextField {...params} label="Пациент" />}
            sx={{ mt: 2 }}
          />




          {/* Дата */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <DatePicker
              disabled
              label="Дата"
              value={date}
              onChange={setDate}
              sx={{ mt: 2, width: '100%' }}
            />
            <TextField
              select
              label="Слот"
              value={selectedScheduleId || ''}
              onChange={e => setselectedScheduleId(Number(e.target.value))}
              sx={{ mt: 2, width: '100%' }}
            >
              {schedule.map(slot => (
                <MenuItem key={slot.id} value={slot.id}>
                  {slot.scheduleStartTime.slice(0,5)} - {slot.scheduleEndTime.slice(0,5)} {slot?.SchedulePrices[0]?.price}₽
                </MenuItem>
              ))}
            </TextField>
          </LocalizationProvider>

          {/* Статус */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select value={status} onChange={e => setStatus(e.target.value)} label="Статус">
              {slotStatuses.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
          </DialogActions>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditSlotModal;
