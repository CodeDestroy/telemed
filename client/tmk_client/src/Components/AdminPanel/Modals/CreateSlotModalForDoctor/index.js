import { useEffect, useState, useContext } from "react";
import {
  Modal,
  Fade,
  Box,
  Typography,
  Autocomplete,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from "@mui/material"; // добавь в импорты в начале файла

import {ru} from 'date-fns/locale/ru';
import { blue, grey } from '@mui/material/colors';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AdminService from "../../../../Services/AdminService";
import DoctorService from "../../../../Services/DoctorService";
import SchedulerService from "../../../../Services/SchedulerService";
import PatientCreateModal from "../../newSchedule/CreateSlotModal";
import { Context } from "../../../../";
const white = '#fff'
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "0.75rem",
  boxShadow: 24,
  p: 4,
  minWidth: 400,
  maxWidth: 500,
};

const CreateTmkModal = ({ open, onClose }) => {
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
  const { store } = useContext(Context);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [openNewPatient, setOpenNewPatient] = useState(false);

  const [date, setDate] = useState(dayjs(new Date()));
  const [timeStart, setTimeStart] = useState(null);
  const [duration, setDuration] = useState(60);
  const [cost, setCost] = useState("");

  const [isCustom, setIsCustom] = useState(false);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [error, setError] = useState("");

  // Загрузка пациентов
  useEffect(() => {
    (async () => {
      const res = await AdminService.getPatients();
      res.data.map(
        (p) =>
          (p.label = `${p.secondName} ${p.firstName} ${
            p.patronomicName ?? ""
          } (${p.snils})`)
      );
      setPatients(res.data);
    })();
  }, []);

  // Получаем доступные интервалы для расписания врача
  const fetchAvailableTimes = async (selectedDate) => {
    if (isCustom) return;
    try {
      setLoadingTimes(true);
      setError("");
      setAvailableTimes([]);

      // ✅ Исправление №1 — нормализуем дату
      const localDate = dayjs(selectedDate).format("YYYY-MM-DD");

      // Получаем расписание и консультации
      const scheduleRes = await SchedulerService.getDcotorScheduleDates(
        store.selectedProfile.id,
        localDate
      );
      const consultationsRes = await DoctorService.getConsultations(
        store.selectedProfile.id,
        localDate
      );


      const schedule = scheduleRes.data || [];
      const consultations = consultationsRes.data[0] || [];

      console.log(consultations)
      const freeSlots = [];

      schedule.forEach((s) => {
        const start = dayjs(`${localDate}T${s.scheduleStartTime}`);
        const end = dayjs(`${localDate}T${s.scheduleEndTime}`);

        let cursor = start;

        while (cursor.isBefore(end)) {
          // конец текущего потенциального слота
          const slotEnd = cursor.add(60, "minute");

          // ✅ Исправление №2 — точная проверка пересечения интервалов
          const isBusy = consultations.some((c) => {
            
            if (c.slotStatusId === 5) return false; // пропускаем отменённые
            const cStart = dayjs(c.slotStartDateTime);
            const cEnd = dayjs(c.slotEndDateTime).subtract(2, 'minute');
            /* console.log(c)
            console.log(cStart)
            console.log(cEnd) */

            // пересечение, если хотя бы частично пересекаются
            return (
              cursor.isBefore(cEnd) && slotEnd.isAfter(cStart)
            );
          });

          if (!isBusy) {
            freeSlots.push(cursor);
          }

          cursor = slotEnd;
        }
      });

      setAvailableTimes(freeSlots);
    } catch (e) {
      console.error(e);
      setError("Ошибка при загрузке расписания");
    } finally {
      setLoadingTimes(false);
    }
  };


  

  const handleSubmit = async () => {
    try {
      setError("");

      if (!selectedPatient) {
        setError("Выберите пациента");
        return;
      }

      if (!timeStart) {
        setError("Выберите время начала");
        return;
      }
      const start = dayjs(date)
        .hour(dayjs(timeStart).hour())
        .minute(dayjs(timeStart).minute());
      const end = start.add(duration, "minute");

      const res = await AdminService.createSlot(
        store.selectedProfile,
        selectedPatient,
        start,
        duration,
        2, 
        isCustom,
        cost
      );

      if (res.status === 200) {
        alert("Запись успешно создана");
        window.location.reload();
      } else {
        setError("Не удалось создать запись");
      }
    } catch (err) {
      console.error(err);
      setError(err.response.data.message);
    }
  };

  useEffect(() => { 
    if (!isCustom && store.selectedProfile && date) fetchAvailableTimes(date); 
  }, [date, isCustom]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography variant="h5" mb={2}>
              Запись на ТМК
            </Typography>

            {error && (
              <Typography color="error" mb={2}>
                {error}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={isCustom}
                  onChange={(e) => setIsCustom(e.target.checked)}
                />
              }
              label="Вне расписания"
            />
            <ThemeProvider theme={defaultTheme}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                {/* ✅ Выбор даты */}
                <DatePicker
                  label="Дата"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
                />

                {/* ✅ Выбор времени */}
                {isCustom ? (
                  <TimePicker
                    label="Выберите время начала"
                    value={timeStart}
                    onChange={(newTime) => setTimeStart(newTime)}
                    slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
                    minutesStep={30}
                    skipDisabled={true}
                  />
                ) : (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Время начала</InputLabel>
                    <Select
                      value={timeStart ? timeStart.format("HH:mm") : ""}
                      label="Время начала"
                      onChange={(e) =>
                        setTimeStart(dayjs(`${dayjs(date).format("YYYY-MM-DD")}T${e.target.value}`))
                      }
                      disabled={loadingTimes || availableTimes.length === 0}
                    >
                      {loadingTimes ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <MenuItem key={time} value={time.format("HH:mm")}>
                            {time.format("HH:mm")}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Нет доступного времени</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}
              </LocalizationProvider>
            </ThemeProvider>

            {/* ✅ Длительность */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Длительность</InputLabel>
              <Select
                value={duration}
                label="Длительность"
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <MenuItem value={60}>60 минут</MenuItem>
                <MenuItem value={30}>30 минут</MenuItem>
              </Select>
            </FormControl>

            {/* ✅ Пациент */}
            <Autocomplete
              disablePortal
              options={patients}
              value={selectedPatient}
              onChange={(e, val) => setSelectedPatient(val)}
              inputValue={inputValue}
              onInputChange={(e, val) => setInputValue(val)}
              renderInput={(params) => (
                <TextField {...params} label="Пациент" sx={{ mt: 3 }} />
              )}
            />


            <Typography sx={{ fontSize: "0.85rem", mt: 1 }}>
              Нет нужного пациента?{" "}
              <span
                onClick={() => setOpenNewPatient(true)}
                style={{ color: "#d30d15", cursor: "pointer" }}
              >
                Добавить
              </span>
            </Typography>
            {isCustom && (
              <TextField
                fullWidth
                label="Стоимость"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={onClose}>Отмена</Button>
              <Button onClick={handleSubmit} variant="contained">
                Сохранить
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>

      <PatientCreateModal
        show={openNewPatient}
        onHide={() => setOpenNewPatient(false)}
      />
    </LocalizationProvider>
  );
};

export default CreateTmkModal;
