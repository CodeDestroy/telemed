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
  ListItemText
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../Header";
import DoctorService from "../../../Services/DoctorService";
import moment from "moment-timezone";
import { Context } from "../../../";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

  useEffect(() => {
    if (slotId) {
      setLoading(true);
      DoctorService.getConsultationBySlotId(slotId)
        .then((res) => setDetails(res.data))
        .catch(() => setDetails({ error: "Ошибка загрузки данных" }))
        .finally(() => setLoading(false));

      /* DoctorService.getFilesBySlotId(slotId).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDetails((prev) => ({ ...prev, files: res.data }));
        }
      }); */
    }
  }, [slotId]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      else patientUrl = process.env.REACT_APP_SERVER_URL + '/short/' + u.shortUrl
    }
  }

  return (
    <>
      <AdminHeader />
      <Box sx={{ p: 4, maxWidth: "900px", mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Консультация {moment(details.slotStartDateTime).format("DD.MM.YYYY HH:mm")} –{" "}
              {moment(details.slotEndDateTime).format("HH:mm")}
          </Typography>

          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              <b>Пациент:</b> {details.Patient.secondName} {details.Patient.firstName}{" "}
              {details.Patient.patronomicName}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              <b>Врач:</b> {details.Doctor.secondName} {details.Doctor.firstName}{" "}
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
          </Box>

          {/* --- Подключение --- */}
        
        <Box mt={3}>
            {canShowJoin && doctorUrl ? (
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
                )
                : 
                (
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Ваша кнопка для подключения появится за 20 минут до начала консультации
                </Typography>
                )
            }
            {patientUrl && (
                <Box display="flex" alignItems="center">
                    <Typography variant="body2" mr={1}>
                        Ссылка для пациента:
                    </Typography>
                    <Link href={patientUrl} target="_blank" underline="hover" variant="body2">
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
    </>
  );
}
