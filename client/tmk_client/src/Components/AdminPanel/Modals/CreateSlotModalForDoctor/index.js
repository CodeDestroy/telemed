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
import { TextField } from "@mui/material"; // добавь в импорты в начале файла

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AdminService from "../../../../Services/AdminService";
import DoctorService from "../../../../Services/DoctorService";
import SchedulerService from "../../../../Services/SchedulerService";
import PatientCreateModal from "../../newSchedule/CreateSlotModal";
import { Context } from "../../../../";

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
  const { store } = useContext(Context);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [openNewPatient, setOpenNewPatient] = useState(false);

  const [date, setDate] = useState(dayjs());
  const [timeStart, setTimeStart] = useState(null);
  const [duration, setDuration] = useState(30);
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
    if (isCustom) return; // вне расписания — не фильтруем
    try {
      setLoadingTimes(true);
      setError("");
      setAvailableTimes([]);

      const scheduleRes = await SchedulerService.getDcotorScheduleDates(
        store.selectedProfile.id,
        selectedDate
      );
      const consultationsRes = await DoctorService.getConsultations(
        store.selectedProfile.id,
        selectedDate
      );

      const schedule = scheduleRes.data || [];
      const consultations = consultationsRes.data?.[0] || [];

      const freeSlots = [];

      schedule.forEach((s) => {
        const start = dayjs(`${selectedDate.format("YYYY-MM-DD")}T${s.scheduleStartTime}`);
        const end = dayjs(`${selectedDate.format("YYYY-MM-DD")}T${s.scheduleEndTime}`);

        let cursor = start;
        while (cursor.add(30, "minute").isBefore(end) || cursor.isSame(end)) {
          const isBusy = consultations.some((c) => {
            if (c.slotStatusId === 5) return false;
            const cStart = dayjs(c.slotStartDateTime);
            const cEnd = dayjs(c.slotEndDateTime);
            return cursor.isAfter(cStart) && cursor.isBefore(cEnd);
          });

          if (!isBusy) {
            freeSlots.push(cursor);
          }

          cursor = cursor.add(30, "minute");
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

  useEffect(() => {
    if (!isCustom && store.selectedProfile && date) fetchAvailableTimes(date);
    console.log(store.selectedProfile)
  }, [date, isCustom]);

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
        .hour(timeStart.hour())
        .minute(timeStart.minute());
      const end = start.add(duration, "minute");

      const res = await AdminService.createSlot(
        store.selectedProfile,
        selectedPatient,
        start,
        duration,
        2
      );

      if (res.status === 200) {
        alert("Запись успешно создана");
        window.location.reload();
      } else {
        setError("Не удалось создать запись");
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка при создании записи");
    }
  };

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
                label="Время начала"
                value={timeStart}
                onChange={(newTime) => setTimeStart(newTime)}
                slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
              />
            ) : (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Время начала</InputLabel>
                <Select
                  value={timeStart ? timeStart.format("HH:mm") : ""}
                  label="Время начала"
                  onChange={(e) =>
                    setTimeStart(dayjs(`${date.format("YYYY-MM-DD")}T${e.target.value}`))
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
                    <MenuItem disabled>Нет свободного времени</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}

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
