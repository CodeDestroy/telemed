import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Link,
  IconButton,
  Tooltip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoctorService from "../../../Services/DoctorService";
import moment from "moment-timezone";
import { Context } from "../../../";

const statusColor = (status) => {
  const code = (status || "").toLowerCase();
  if (code.includes("оплачено") || code.includes("успешно")) return "success";
  if (code.includes("обрабатывается") || code.includes("ожидании") || code.includes("pending")) return "warning";
  if (code.includes("ошибка") || code.includes("отменён")) return "error";
  return "default";
};

export default function ConsultationDetailsModal({ open, onClose, slotId }) {
  const { store } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && slotId) {
      setLoading(true);
      DoctorService.getConsultationBySlotId(slotId)
        .then((res) => setDetails(res.data))
        .catch(() => setDetails({ error: "Ошибка загрузки данных" }))
        .finally(() => setLoading(false));
    } else {
      setDetails(null);
    }
  }, [open, slotId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

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
      else patientUrl = u.originalUrl;
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Детали консультации</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : details ? (
          details.error ? (
            <Typography color="error">{details.error}</Typography>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <b>Пациент:</b> {details.Patient.secondName} {details.Patient.firstName}{" "}
                {details.Patient.patronomicName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <b>Доктор:</b> {details.Doctor.secondName} {details.Doctor.firstName}{" "}
                {details.Doctor.patronomicName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Дата и время:</b>{" "}
                {moment(details.slotStartDateTime).format("DD.MM.YYYY HH:mm")} –{" "}
                {moment(details.slotEndDateTime).format("HH:mm")}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <b>Статус оплаты:</b>{" "}
                <Chip
                  label={details.Payment.PaymentStatus.description || "—"}
                  color={statusColor(details.Payment.PaymentStatus.description)}
                  size="small"
                />
              </Typography>

              {/* --- Ссылки и кнопки подключения --- */}
              {canShowJoin && (
                <Box mt={3}>
                  {doctorUrl && (
                    <Box mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        href={doctorUrl}
                        target="_blank"
                      >
                        Подключиться к консультации
                      </Button>
                    </Box>
                  )}
                  {patientUrl && (
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" mr={1}>
                        Ссылка для пациента:
                      </Typography>
                      <Link href={patientUrl} target="_blank" underline="hover">
                        {patientUrl}
                      </Link>
                      <Tooltip title={copied ? "Скопировано!" : "Скопировать"}>
                        <IconButton onClick={() => handleCopy(patientUrl)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              )}

              {/* --- Файлы --- */}
              <Box mt={3}>
                <Typography variant="subtitle1">Прикреплённые файлы:</Typography>
                {details.files && details.files.length > 0 ? (
                  <List dense>
                    {details.files.map((f) => (
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
                    Нет файлов
                  </Typography>
                )}
              </Box>
            </Box>
          )
        ) : (
          <Typography>Нет данных</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}
