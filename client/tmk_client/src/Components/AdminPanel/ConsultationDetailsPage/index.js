import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Link,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../Header";
import DoctorService from "../../../Services/DoctorService";
import moment from "moment-timezone";
import { Context } from "../../../";

const statusColor = (status) => {
  const code = (status || "").toLowerCase();
  if (code.includes("оплачено") || code.includes("успешно")) return "success";
  if (code.includes("ожид") || code.includes("pending")) return "warning";
  if (code.includes("ошибка") || code.includes("отмен")) return "error";
  return "default";
};

export default function ConsultationDetailsPage() {
  const { id: slotId } = useParams();
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [protocol, setProtocol] = useState("");
  /* const [sendingCount, setSendingCount] = useState(0); */
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // Новые состояния для завершения консультации
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [endTime, setEndTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (slotId) {
      setLoading(true);
      DoctorService.getConsultationBySlotId(slotId)
        .then((res) => {
          setDetails(res.data);
          setProtocol(res.data?.Room?.protocol || "");
        })
        .catch(() => setDetails({ error: "Ошибка загрузки данных" }))
        .finally(() => setLoading(false));
    }
  }, [slotId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProtocol = async () => {
    setSaving(true);
    try {
      await DoctorService.setProtocol(details.Room.id, protocol)
      // пример вызова бэка: await DoctorService.updateProtocol(slotId, protocol);
      setSnackbar({ open: true, message: "Протокол сохранён", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Ошибка при сохранении", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSendProtocol = async () => {
    setSending(true);
    try {
      // пример вызова бэка: await DoctorService.sendProtocol(slotId);
      await DoctorService.sendProtocol(details.Room.id);
      details.Room.sendCount++
      /* setSendingCount((prev) => prev + 1); */
      setSnackbar({ open: true, message: "Протокол отправлен пациенту", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Ошибка при отправке", severity: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleEndConsultation = () => {
    // Открываем модальное окно для выбора времени
    setEndTime(moment().format("YYYY-MM-DDTHH:mm"));
    setEndDialogOpen(true);
  };

  const handleConfirmEnd = async () => {
    setEnding(true);
    try {
      // Пример вызова:
      const response = await DoctorService.endConsultation(slotId, endTime)
      if (response.status == 200) {
        window.location.reload();
      }
      // await DoctorService.endConsultation(slotId, { endTime });
      setSnackbar({
        open: true,
        message: `Консультация завершена (${moment(endTime).format("HH:mm DD.MM.YYYY")})`,
        severity: "success",
      });
      setEndDialogOpen(false);
      // Обновим данные локально
      setDetails((prev) => ({
        ...prev,
        meetengEnd: endTime,
      }));
    } catch {
      setSnackbar({ open: true, message: "Ошибка при завершении", severity: "error" });
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!details || details.error) {
    return (
      <>
        <AdminHeader />
        <Box p={4}>
          <Typography color="error">{details?.error || "Данные не найдены"}</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
            Назад
          </Button>
        </Box>
      </>
    );
  }

  const isPaymentSuccessful = (details?.Payment?.PaymentStatus?.description || "")
    .toLowerCase()
    .includes("успешно");

  const consultationStart = moment(details?.slotStartDateTime);
  const now = moment();
  const minutesToStart = consultationStart.diff(now, "minutes");
  const canShowJoin = isPaymentSuccessful && minutesToStart <= 20;

  let doctorUrl = null;
  let patientUrl = null;

  if (details?.Room?.Urls?.length) {
    for (const u of details.Room.Urls) {
      if (u.userId === store.user.id) doctorUrl = u.originalUrl;
      else patientUrl = process.env.REACT_APP_SERVER_URL + "/short/" + u.shortUrl;
    }
  }

  return (
    <>
      <AdminHeader />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>

        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Консультация {moment(details.slotStartDateTime).format("DD.MM.YYYY HH:mm")} –{" "}
            {moment(details.slotEndDateTime).format("HH:mm")}
          </Typography>

          <Box mt={2}>
            <Typography variant="subtitle1">
              <b>Пациент:</b> {details.Patient.secondName} {details.Patient.firstName}{" "}
              {details.Patient.patronomicName}
            </Typography>

            <Typography variant="subtitle1">
              <b>Врач:</b> {details.Doctor.secondName} {details.Doctor.firstName}{" "}
              {details.Doctor.patronomicName}
            </Typography>

            <Typography variant="body2" mt={1}>
              <b>Дата и время:</b> {moment(details.slotStartDateTime).format("DD.MM.YYYY HH:mm")} –{" "}
              {moment(details.slotEndDateTime).format("HH:mm")}
            </Typography>

            <Typography variant="body2" mt={1}>
              <b>Статус оплаты:</b>{" "}
              <Chip
                label={details.Payment.PaymentStatus.description || "—"}
                color={statusColor(details.Payment.PaymentStatus.description)}
                size="small"
              />
            </Typography>
          </Box>

          {/* --- Подключение --- */}
          <Box mt={3}>
            {canShowJoin && doctorUrl && !details.Room.ended ? (
              <Box mb={2}>
                <Button variant="contained" color="primary" href={doctorUrl} target="_blank">
                  Подключиться к консультации
                </Button>
              </Box>
            ) : ( !details.Room.ended ?
              <Typography variant="body2" color="text.secondary" mb={2}>
                Кнопка подключения появится за 20 минут до начала консультации
              </Typography>
              :
              <Typography variant="body2" color="text.secondary" mb={2}>
                Консультация завершена
              </Typography>
            )}

            {patientUrl && !details.Room.ended && (
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="body2">Ссылка для пациента:</Typography>
                <Link href={patientUrl} target="_blank" underline="hover" variant="body2">
                  {patientUrl}
                </Link>
                <Tooltip title={copied ? "Скопировано!" : "Скопировать"}>
                  <IconButton size="small" onClick={() => handleCopy(patientUrl)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* --- Протокол --- */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Протокол консультации
            </Typography>
            <TextField
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              multiline
              rows={6}
              fullWidth
              placeholder="Введите протокол консультации..."
            />
            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
              <Button variant="outlined" onClick={handleSaveProtocol} disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button variant="contained" color="primary" onClick={handleSendProtocol} disabled={sending}>
                {sending ? "Отправка..." : "Отправить"}
              </Button>
              <Typography variant="body2" color="text.secondary" alignSelf="center">
                Отправлено раз: {details.Room.sendCount ? details.Room.sendCount : 0}
              </Typography>
            </Box>
          </Box>

          {/* --- Завершение консультации --- */}
          {!details?.Room?.ended  && !details?.meetengEnd && (
            <Box mt={4}>
              <Button variant="contained" color="error" onClick={handleEndConsultation}>
                Завершить консультацию
              </Button>
            </Box>
          )}

          {/* --- Файлы --- */}
          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={500}>
              Прикреплённые файлы:
            </Typography>
            {details.Attachments && details.Attachments.length > 0 ? (
              <List dense>
                {details.Attachments.map((f) => (
                  <ListItem key={f.id} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={
                        <Link
                          href={
                            f.url.startsWith("http")
                              ? f.url
                              : `${process.env.REACT_APP_SERVER_URL}${f.url}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          {f.originalname || f.filename}
                        </Link>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Нет прикреплённых файлов
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Диалог выбора времени завершения */}
      <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Завершить консультацию</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Укажите фактическое время завершения консультации:
          </Typography>
          <TextField
            type="datetime-local"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleConfirmEnd}
            variant="contained"
            color="error"
            disabled={ending}
          >
            {ending ? "Завершение..." : "Подтвердить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
