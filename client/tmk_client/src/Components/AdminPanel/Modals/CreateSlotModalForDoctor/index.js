import { useEffect, useState, useContext } from "react";
import {
  Modal,
  Fade,
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ru } from "date-fns/locale";

import AdminService from "../../../../Services/AdminService";
import DoctorService from "../../../../Services/DoctorService";
import { Context } from "../../../..";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "0.75rem",
  boxShadow: 24,
  p: 4,
  minWidth: 450,
};

const slotStatuses = [
  { value: 2, label: "Ждёт оплаты" },
  { value: 3, label: "Оплачено" },
];

const consultationTypes = [
  { value: 1, label: "ТМК" },
  { value: 2, label: "Второе мнение" },
];

const CreateTmkModal = ({ open, onClose }) => {
  const { store } = useContext(Context);

  const doctorId = store.selectedProfile.id;

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [serviceId, setServiceId] = useState(1); // ← выбор типа консультации

  const [schedule, setSchedule] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const [date, setDate] = useState(null);
  const [status, setStatus] = useState(2);

  const [error, setError] = useState(null);

  // Загружаем пациентов
  useEffect(() => {
    (async () => {
      const res = await AdminService.getPatients();
      res.data.forEach(
        (p) =>
          (p.label = `${p.secondName} ${p.firstName} ${p.patronomicName ?? ""} (${p.snils})`)
      );
      setPatients(res.data);
    })();
  }, []);

  // Загрузка расписания
  const fetchSchedule = async (doctorId, serviceId, date) => {
    if (!doctorId || !serviceId || !date) return;

    try {
      const res = await DoctorService.getScheduleByDateV2(
        doctorId,
        dayjs(date).format("YYYY-MM-DD"),
        serviceId
      );

      const filtered = res.data.filter(
        (s) => s.scheduleServiceTypeId === serviceId
      );

      setSchedule(filtered);
      setSelectedScheduleId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // При изменении serviceId → обновить расписание
  useEffect(() => {
    if (!date) return;

    setSchedule([]);
    setSelectedScheduleId(null);

    fetchSchedule(doctorId, serviceId, date);
  }, [serviceId]);

  // При изменении даты → обновить расписание
  useEffect(() => {
    if (!date) return;

    fetchSchedule(doctorId, serviceId, date);
  }, [date]);

  const handleSubmit = async () => {
    if (!selectedPatient) return setError("Выберите пациента");
    if (!selectedScheduleId) return setError("Выберите время");

    try {
      const response = await AdminService.createSlotV2(
        { id: doctorId },
        selectedPatient,
        selectedScheduleId,
        status
      );

      if (response.status === 200) {
        alert("Успешно");
        window.location.reload();
      } else {
        setError("Ошибка при сохранении");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при создании записи");
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={modalStyle}>
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          <Typography variant="h5" mb={2}>
            Создать консультацию
          </Typography>

          {/* Тип консультации */}
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Тип консультации</InputLabel>
            <Select
              label="Тип консультации"
              value={serviceId}
              onChange={(e) => setServiceId(Number(e.target.value))}
            >
              {consultationTypes.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Пациент */}
          <Autocomplete
            disablePortal
            options={patients}
            value={selectedPatient}
            onChange={(e, val) => setSelectedPatient(val)}
            getOptionLabel={(o) => o.label || ""}
            renderInput={(params) => <TextField {...params} label="Пациент" />}
            sx={{ mt: 2 }}
          />

          {/* Дата */}
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <DatePicker
              label="Дата"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ mt: 2, width: "100%" }}
            />
          </LocalizationProvider>

          {/* Время */}
          <TextField
            select
            label="Время"
            value={selectedScheduleId || ""}
            onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
            sx={{ mt: 2, width: "100%" }}
          >
            {schedule.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.scheduleStartTime.slice(0, 5)} - {s.scheduleEndTime.slice(0, 5)} •{" "}
                {s?.SchedulePrices?.[0]?.price ?? "?"}₽
              </MenuItem>
            ))}
          </TextField>

          {/* Статус */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              label="Статус"
              onChange={(e) => setStatus(e.target.value)}
            >
              {slotStatuses.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Сохранить
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateTmkModal;
