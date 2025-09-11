import { useEffect, useState, useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogActions, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import AdminService from '../../../../Services/AdminService';
import { Context } from '../../../..';
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
  { value: 'FREE', label: 'Свободно' },
  { value: 'WAITING_PAYMENT', label: 'Ждёт оплаты' },
  { value: 'PAID', label: 'Оплачено' },
  { value: 'DONE', label: 'Завершено' },
  { value: 'CANCELLED', label: 'Отменено' },
];

const EditSlotModal = (props) => {
  const { store } = useContext(Context);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [error, setError] = useState(null);



  const setSelectedPatientById = async (patientId) => {
    const patient = patients.find(({ id }) => id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  const setSelectedDoctorById = async (doctorId) => {
    const doctor = doctors.find(({ id }) => id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
    }
  };

  useEffect(() => {
    if (props.open && props.item) {
      fetchPatients()
      fetchDoctors()
      setSelectedPatient(props.item.patient || null);
      setSelectedDoctor(props.item.doctor || null);
      setStatus(props.item.status || '0');
      setDate(props.item.date || dayjs().format('YYYY-MM-DD'));
      setTime(props.item.scheduleStartTime || '09:00');
    }
    console.log(props)
  }, [props.open, props.item]);

  useEffect(() => {
    if (patients && props?.item?.patientId)
      setSelectedPatientById(props.item.patientId)
  }, [patients, props.item])

   useEffect(() => {
    if (doctors && props?.item?.doctorId)
      setSelectedDoctorById(props.item.doctorId)
  }, [doctors, props.item])

  async function fetchPatients() {
    let response = await AdminService.getPatients();
    response.data.forEach((doc) => {
      doc.label = doc.secondName + ' ' + doc.firstName + ' ' + doc.patronomicName;
    });
    setPatients(response.data);
  }

  async function fetchDoctors() {
    let response = await AdminService.getDoctors(store.selectedProfile.id);
    response.data.forEach((doc) => {
      doc.label = doc.secondName + ' ' + doc.firstName + ' ' + doc.patronomicName;
    });
    setDoctors(response.data);
  }

  const handleSubmit = async () => {
    try {
      const datetimeStr = `${date}T${time}`;
      const response = await AdminService.updateSlot(
        props.item.id,
        selectedDoctor,
        selectedPatient,
        dayjs(datetimeStr),
        status
      );
      if (response.status === 200) {
        alert('Изменения сохранены');
        window.location.reload();
      } else {
        setError('Ошибка при сохранении, попробуйте снова');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      setError('Произошла ошибка при отправке данных');
    }
  };

  if (!props.open || !props.item) return null;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      open={props.open}
      onClose={props.onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { timeout: 500 },
      }}
    >
      <Fade in={props.open}>
        <Box sx={style}>
          {error && (
            <Typography variant="h6" sx={{ color: 'red' }}>
              {error}
            </Typography>
          )}

          <Typography variant="h5" component="h2" gutterBottom>
            Редактировать консультацию
          </Typography>

          {/* Пациент */}
          <Autocomplete
            disablePortal
            options={patients}
            renderInput={(params) => <TextField {...params} label="Пациент" />}
            value={selectedPatient}
            onChange={(e, newValue) => setSelectedPatient(newValue)}
            getOptionLabel={(option) =>
              option?.secondName + ' ' + option?.firstName + ' (' + option?.snils + ')' || ''
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ mt: 2 }}
          />

          {/* Врач */}
          <Autocomplete
            disablePortal
            options={doctors}
            renderInput={(params) => <TextField {...params} label="Врач" />}
            value={selectedDoctor}
            onChange={(e, newValue) => setSelectedDoctor(newValue)}
            getOptionLabel={(option) =>
              option?.secondName + ' ' + option?.firstName + ' ' + option?.patronomicName || ''
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ mt: 2 }}
          />

          {/* Дата */}
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mt: 2, width: '100%' }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Время */}
          <TextField
            label="Время"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            sx={{ mt: 2, width: '100%' }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Статус */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Статус">
              {slotStatuses.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={props.onClose}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditSlotModal;
