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
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
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
  { value: 1, label: 'Ждёт оплаты' },
  { value: 2, label: 'Ждёт оплаты' },
  { value: 3, label: 'Оплачено' },
  { value: 4, label: 'Завершено' },
  { value: 5, label: 'Отменено' },
];

const EditSlotModal = ({ open, onClose, item }) => {
  const { store } = useContext(Context);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [status, setStatus] = useState(1);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [error, setError] = useState(null);

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

  // Загрузка слотов по выбранному врачу и сервису
  const fetchSlots = async (doctorId, serviceId, date) => {
    if (!doctorId || !serviceId || !date) return;
    try {
      const res = await DoctorService.getScheduleByDateV2(doctorId, dayjs(date).format('YYYY-MM-DD'));
      const filteredSlots = res.data.filter(s => s.scheduleServiceTypeId === serviceId);
      setSlots(filteredSlots);

      // Выбираем текущий слот
      setTime(filteredSlots.find(s => s.id === item.id)?.scheduleStartTime || date);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (open && item) {
      fetchPatients();
      fetchDoctors();
      console.log(item)
      setSelectedPatient(item.patient || null);
      setSelectedDoctor(item.doctor || null);
      setStatus(item.slotStatusId || 1);
      setDate(new Date(item.date));

      // Загружаем слоты для текущего врача
      if (item.doctorId && item.Service?.id) {
        fetchSlots(item.doctorId, item.Service.id, item.date);
      }
    }
  }, [open, item]);

  const handleSubmit = async () => {
    try {
      const datetimeStr = `${dayjs(date).format('YYYY-MM-DD')}T${dayjs(time).format('HH:mm:ss')}`;
      const response = await AdminService.editSlot(item.slotId, selectedDoctor, selectedPatient, datetimeStr, '60', status);

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
    if (patients.length && item?.patientId) {
      const patient = patients.find(p => p.id === item.patientId);
      if (patient) setSelectedPatient(patient);
    }
  }, [patients, item]);

  // После загрузки врачей
  useEffect(() => {
    if (doctors.length && item?.doctorId) {
      const doctor = doctors.find(d => d.id === item.doctorId);
      if (doctor) setSelectedDoctor(doctor);
    }
  }, [doctors, item]);


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

          {/* Пациент */}
          <Autocomplete
            disablePortal
            options={doctors}
            value={selectedDoctor || null} // обязательно null если не выбран
            onChange={(e, newValue) => setSelectedDoctor(newValue)}
            getOptionLabel={o => o ? `${o.secondName} ${o.firstName} ${o.patronomicName}` : ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={params => <TextField {...params} label="Врач" />}
            sx={{ mt: 2 }}
          />

          <Autocomplete
            
            disablePortal
            options={patients}
            value={selectedPatient || null} // обязательно null если не выбран
            onChange={(e, newValue) => setSelectedPatient(newValue)}
            getOptionLabel={o => o ? `${o.secondName} ${o.firstName} (${o.snils})` : ''}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
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

            {/* Время */}
            <TextField
              select
              label="Время"
              value={time}
              onChange={e => setTime(e.target.value)}
              sx={{ mt: 2, width: '100%' }}
            >
              {slots.map(slot => {
                const disabled = slot.slotId && slot.id !== item.id;
                return (
                  <MenuItem key={slot.id} value={slot.scheduleStartTime} disabled={disabled}>
                    {slot.scheduleStartTime.slice(0,5)} - {slot.scheduleEndTime.slice(0,5)} {disabled ? '(занят)' : ''}
                  </MenuItem>
                )
              })}
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
