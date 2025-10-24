import React, { useEffect, useContext, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import { Context } from '../../../..';
import AdminService from '../../../../Services/AdminService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import LoadingScreen from '../../../Loading';
import adminLocations from '../../../../Locations/AdminLocations';

const PatientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState(null);

  // форма для нового ребёнка
  const [newChild, setNewChild] = useState({
    lastName: '',
    firstName: '',
    patronymicName: '',
    birthDate: null,
    snils: '',
    polis: '',
    docSeries: '',
    docNumber: ''
  });

  // === загрузка пациента ===
  useEffect(() => {
    if (store?.user?.id) {
      async function fetchData() {
        try {
          const resPatient = await AdminService.getPatient(id);
          setPatient(resPatient.data);

          const resChildren = await AdminService.getChildrenByPatientId(id);
          setChildren(resChildren.data || []);
        } catch (e) {
          console.error(e);
        }
      }
      fetchData();
    }
  }, [store, id]);

  const handleSave = async () => {
    try {
      const response = await AdminService.editPatient(id, patient);
      if (response.status === 200) {
        navigate(adminLocations.patientManagement);
      } else {
        setError(response.data.message);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const handleAddChild = async () => {
    try {
      if (!newChild.lastName || !newChild.firstName || !newChild.birthDate) {
        alert('Заполните обязательные поля: фамилия, имя, дата рождения');
        return;
      }

      newChild.patientId = id; // добавляем patientId в данные ребёнка

      const res = await AdminService.addChildToPatient(newChild);
      if (res.status === 200 || res.status === 201) {
        setChildren([...children, res.data]);
        setNewChild({
          lastName: '',
          firstName: '',
          patronymicName: '',
          birthDate: null,
          snils: '',
          polis: '',
          docSeries: '',
          docNumber: ''
        });
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при добавлении ребёнка');
    }
  };

  if (!patient) return <LoadingScreen />;

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
          Редактировать пациента {patient.secondName} {patient.firstName}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Typography color="error">{error}</Typography>}

          <TextField
            label="Фамилия"
            variant="outlined"
            fullWidth
            value={patient.secondName || ''}
            onChange={(e) => setPatient({ ...patient, secondName: e.target.value })}
          />
          <TextField
            label="Имя"
            variant="outlined"
            fullWidth
            value={patient.firstName || ''}
            onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
          />
          <TextField
            label="Отчество"
            variant="outlined"
            fullWidth
            value={patient.patronomicName || ''}
            onChange={(e) => setPatient({ ...patient, patronomicName: e.target.value })}
          />

          <TextField
            label="Телефон"
            variant="outlined"
            fullWidth
            value={patient.User.phone || ''}
            onChange={(e) =>
              setPatient({ ...patient, User: { ...patient.User, phone: e.target.value } })
            }
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={patient.User.email || ''}
            onChange={(e) =>
              setPatient({ ...patient, User: { ...patient.User, email: e.target.value } })
            }
          />
          <TextField
            label="СНИЛС"
            variant="outlined"
            fullWidth
            value={patient.snils || ''}
            onChange={(e) => setPatient({ ...patient, snils: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="Дата рождения"
              value={dayjs(patient.birthDate)}
              onChange={(newValue) => setPatient({ ...patient, birthDate: newValue })}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disableFuture
            />
          </LocalizationProvider>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={patient.User.confirmed}
                  onChange={() =>
                    setPatient({
                      ...patient,
                      User: { ...patient.User, confirmed: !patient.User.confirmed }
                    })
                  }
                />
              }
              label="Подтверждён"
            />
          </FormGroup>

          <Button variant="contained" color="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </Box>

        {/* ====== ДЕТИ ====== */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Дети пациента
        </Typography>

        {children.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {children.map((child) => (
              <Paper
                key={child.id}
                sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <Typography>
                    <strong>
                      {child.lastName} {child.firstName} {child.patronymicName || ''}
                    </strong>
                  </Typography>
                  <Typography color="text.secondary">
                    Дата рождения: {dayjs(child.birthDate).format('DD.MM.YYYY')}
                  </Typography>
                </div>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">Нет зарегистрированных детей</Typography>
        )}

        {/* ====== ДОБАВИТЬ РЕБЁНКА ====== */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Добавить ребёнка
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <TextField
            label="Фамилия"
            value={newChild.lastName}
            onChange={(e) => setNewChild({ ...newChild, lastName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Имя"
            value={newChild.firstName}
            onChange={(e) => setNewChild({ ...newChild, firstName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Отчество"
            value={newChild.patronymicName}
            onChange={(e) => setNewChild({ ...newChild, patronymicName: e.target.value })}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="Дата рождения"
              value={newChild.birthDate}
              onChange={(date) => setNewChild({ ...newChild, birthDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disableFuture
            />
          </LocalizationProvider>
          <TextField
            label="СНИЛС"
            value={newChild.snils}
            onChange={(e) => setNewChild({ ...newChild, snils: e.target.value })}
            fullWidth
          />
          <TextField
            label="Полис"
            value={newChild.polis}
            onChange={(e) => setNewChild({ ...newChild, polis: e.target.value })}
            fullWidth
          />
          <TextField
            label="Серия документа"
            value={newChild.docSeries}
            onChange={(e) => setNewChild({ ...newChild, docSeries: e.target.value })}
            fullWidth
          />
          <TextField
            label="Номер документа"
            value={newChild.docNumber}
            onChange={(e) => setNewChild({ ...newChild, docNumber: e.target.value })}
            fullWidth
          />
          <Button variant="contained" color="secondary" onClick={handleAddChild}>
            Добавить ребёнка
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default PatientEdit;
