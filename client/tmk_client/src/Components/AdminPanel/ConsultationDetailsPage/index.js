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
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment-timezone";

import AdminHeader from "../Header";
import DoctorService from "../../../Services/DoctorService";
import DiagnosisSelector from "../Modals/DiagnosisSelector";
import { Context } from "../../../";

/* ---------------- helpers ---------------- */

const statusColor = (status) => {
  const code = (status || "").toLowerCase();
  if (code.includes("успеш")) return "success";
  if (code.includes("ожид")) return "warning";
  if (code.includes("ошиб") || code.includes("отмен")) return "error";
  return "default";
};

const Field = ({ title, value, onChange, rows = 3 }) => (
  <Box mt={2}>
    <Typography variant="subtitle1">{title}</Typography>
    <TextareaAutosize
      className="w-100"
      minRows={rows}
      maxRows={25}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        borderColor: "#d9d9d9",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        fontSize: "1rem",
        width: "100%",
      }}
    />
  </Box>
);

/* ---------------- component ---------------- */

export default function ConsultationDetailsPage() {
  const { id: slotId } = useParams();
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const isEnded = details?.Room?.ended || details?.meetengEnd;

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /* ---------- завершение консультации ---------- */
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [endTime, setEndTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
  const [ending, setEnding] = useState(false);

  /* ---------- протокол (НОВАЯ ФОРМА) ---------- */

  const [complaints, setComplaints] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.complaints : '');
  const [anamnesisDisease, setAnamnesisDisease] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.anamnesis_disease : '');
  const [anamnesisLife, setAnamnesisLife] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.anamnesis_life : '');
  const [vaccination, setVaccination] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.vaccination : '');
  const [allergy, setAllergy] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.allergy_anamnesis : '');
  const [epidAnamnesis, setEpidAnamnesis] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.epid_anamnesis : '');
  const [objectiveData, setObjectiveData] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.objective_data : '');
  const [goal, setGoal] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.goal : '');
  const [additionalData, setAdditionalData] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.additional_data : '');
  const [treatmentBefore, setTreatmentBefore] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.treatment_before : '');

  const [diagnosticHypothesis, setDiagnosticHypothesis] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.description : '');
  const [examPlan, setExamPlan] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.examination_plan : '');
  const [generalRecommendations, setGeneralRecommendations] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.recommendations : '');
  const [treatmentRecommendations, setTreatmentRecommendations] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.treatment_recommendations : '');
  const [followUp, setFollowUp] = useState(details?.Room?.Protocol ? details?.Room?.Protocol.follow_up : '');

  /* ---------- МКБ ---------- */
  const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  /* ---------- загрузка ---------- */

  useEffect(() => {
    DoctorService.getConsultationBySlotId(slotId)
      .then((res) => setDetails(res.data))
      .catch(() => setDetails({ error: "Ошибка загрузки данных" }))
      .finally(() => setLoading(false));
  }, [slotId]);

  /* ---------- действия ---------- */

  const handleSaveProtocol = async () => {
    setSaving(true);
    try {
      await DoctorService.setProtocol(details.Room.id, {
        complaints,
        anamnesisDisease,
        anamnesisLife,
        vaccination,
        allergy,
        epidAnamnesis,
        objectiveData,
        goal,
        additionalData,
        treatmentBefore,
        diagnosticHypothesis,
        examPlan,
        generalRecommendations,
        treatmentRecommendations,
        followUp,
        mkb: selectedDiagnosis?.id || null,
      });
      setSnackbar({ open: true, message: "Протокол сохранён", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Ошибка сохранения", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSendProtocol = async () => {
    setSending(true);
    try {
      await DoctorService.sendProtocol(details.Room.id);
      details.Room.sendCount++;
      setSnackbar({ open: true, message: "Протокол отправлен", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Ошибка отправки", severity: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleDownloadProtocol = async () => {
    setDownloading(true);
    try {
      const response = await DoctorService.downloadProtocol(details.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Протокол_${details.Patient.secondName}_${moment(details.slotStartDateTime).format("DD.MM.YYYY")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setSnackbar({ open: true, message: "Ошибка скачивания PDF", severity: "error" });
    } finally {
      setDownloading(false);
    }
  };

  const handleConfirmEnd = async () => {
    setEnding(true);
    try {
      await DoctorService.endConsultation(slotId, endTime);
      window.location.reload();
    } catch {
      setSnackbar({ open: true, message: "Ошибка завершения", severity: "error" });
    } finally {
      setEnding(false);
    }
  };

  useEffect(() => {
    if (details?.Room?.Protocol) {
      setComplaints(details?.Room?.Protocol.complaints);
      setAnamnesisDisease(details?.Room?.Protocol.anamnesis_disease);
      setAnamnesisLife(details?.Room?.Protocol.anamnesis_life);
      setVaccination(details?.Room?.Protocol.vaccination);
      setAllergy(details?.Room?.Protocol.allergy_anamnesis);
      setEpidAnamnesis(details?.Room?.Protocol.epid_anamnesis);
      setObjectiveData(details?.Room?.Protocol.objective_data);
      setGoal(details?.Room?.Protocol.goal);
      setAdditionalData(details?.Room?.Protocol.additional_data);
      setTreatmentBefore(details?.Room?.Protocol.treatment_before);

      setDiagnosticHypothesis(details?.Room?.Protocol.description);
      setExamPlan(details?.Room?.Protocol.examination_plan);
      setGeneralRecommendations(details?.Room?.Protocol.recommendations);
      setTreatmentRecommendations(details?.Room?.Protocol.treatment_recommendations);
      setFollowUp(details?.Room?.Protocol.follow_up);
      setSelectedDiagnosis({id: details?.Room?.Protocol.mkb_diagnosis_id})
    }
  }, [details])

  /* ---------- render ---------- */

  if (loading) {
    return (
      <>
        <AdminHeader />
        <Box display="flex" justifyContent="center" mt={10}>
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
          <Typography color="error">Ошибка загрузки</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Назад
        </Button>

        <Paper sx={{ p: 4, mt: 2 }}>
          {/* --------- ШАПКА --------- */}
          <Typography variant="h5" fontWeight={600}>
            Онлайн консультация педиатра
          </Typography>

          <Typography mt={1}>
            <b>Пациент:</b> {details.Patient.secondName} {details.Patient.firstName}
          </Typography>
          <Typography>
            <b>Врач:</b> {details.Doctor.secondName} {details.Doctor.firstName}
          </Typography>
          <Typography>
            <b>Дата:</b>{" "}
            {moment(details.slotStartDateTime).format("DD.MM.YYYY HH:mm")}
          </Typography>

          <Chip
            sx={{ mt: 1 }}
            size="small"
            label={details.Payment.PaymentStatus.description}
            color={statusColor(details.Payment.PaymentStatus.description)}
          />

          <Box mt={1}>
            <Chip
              size="small"
              label={isEnded ? "Консультация завершена" : "Консультация активна"}
              color={isEnded ? "default" : "success"}
            />
          </Box>


          {/* --------- ФОРМА ПРОТОКОЛА --------- */}

          <Field title="Жалобы" value={complaints} onChange={setComplaints} />
          <Field title="Анамнез заболевания" value={anamnesisDisease} onChange={setAnamnesisDisease} />
          <Field title="Анамнез жизни" value={anamnesisLife} onChange={setAnamnesisLife} />
          <Field title="Вакцинация" value={vaccination} onChange={setVaccination} />
          <Field title="Аллергологический анамнез" value={allergy} onChange={setAllergy} />
          <Field title="Эпидемиологический анамнез" value={epidAnamnesis} onChange={setEpidAnamnesis} />
          <Field title="Объективные данные (рост, вес)" value={objectiveData} onChange={setObjectiveData} />
          <Field title="Цель обращения" value={goal} onChange={setGoal} />
          <Field title="Дополнительные данные" value={additionalData} onChange={setAdditionalData} />
          <Field title="Лечение до консультации" value={treatmentBefore} onChange={setTreatmentBefore} />

          {/* ---- Диагностическая гипотеза ---- */}
          <Box mt={3}>
            <Typography variant="subtitle1">
              Диагностическая гипотеза (синдромальный диагноз)
            </Typography>

            <Box display="flex" gap={1}>
              <TextareaAutosize
                className="w-100"
                minRows={3}
                value={diagnosticHypothesis}
                onChange={(e) => setDiagnosticHypothesis(e.target.value)}
                style={{
                  borderColor: "#d9d9d9",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
              <Button variant="outlined" onClick={() => setDiagnosisModalOpen(true)}>
                МКБ
              </Button>
            </Box>
          </Box>

          <Field title="План обследования" value={examPlan} onChange={setExamPlan} />
          <Field title="Общие рекомендации" value={generalRecommendations} onChange={setGeneralRecommendations} />
          <Field title="Рекомендации по лечению" value={treatmentRecommendations} onChange={setTreatmentRecommendations} />
          <Field title="Явка" value={followUp} onChange={setFollowUp} />

          {/* --------- КНОПКИ --------- */}
          <Box mt={4} display="flex" gap={2} flexWrap="wrap">
            <Button onClick={handleSaveProtocol} disabled={saving}>
              Сохранить
            </Button>
            <Button variant="contained" onClick={handleSendProtocol} disabled={sending}>
              Отправить
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadProtocol}
              disabled={downloading}
            >
              PDF
            </Button>
          </Box>
          {/* --------- ПРИКРЕПЛЁННЫЕ ФАЙЛЫ --------- */}
          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={500}>
              Прикреплённые файлы:
            </Typography>

            {details && details.Attachments && details.Attachments.length > 0 ? (
              <List dense>
                {details.Attachments.map((file) => (
                  <ListItem key={file.id} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={
                        <Link
                          href={
                            file.url.startsWith("http")
                              ? file.url
                              : `${process.env.REACT_APP_SERVER_URL}${file.url}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          {file.originalname || file.filename}
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

      {/* --------- МКБ --------- */}
      <DiagnosisSelector
        open={diagnosisModalOpen}
        onClose={() => setDiagnosisModalOpen(false)}
        onSelect={(diag) => {
          setSelectedDiagnosis(diag);
          setDiagnosticHypothesis((prev) =>
            prev
              ? `${prev}\n${diag.code} — ${diag.name}`
              : `${diag.code} — ${diag.name}`
          );
          setDiagnosisModalOpen(false);
        }}
      />

      {/* --------- ЗАВЕРШЕНИЕ --------- */}
      <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)}>
        <DialogTitle>Завершить консультацию</DialogTitle>
        <DialogContent>
          <TextField
            type="datetime-local"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndDialogOpen(false)}>Отмена</Button>
          <Button color="error" onClick={handleConfirmEnd} disabled={ending}>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      

      {/* --------- SNACKBAR --------- */}
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
