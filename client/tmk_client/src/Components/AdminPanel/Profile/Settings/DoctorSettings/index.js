import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  TextField,
  Avatar,
  Switch,
  FormGroup,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import Header from '../../../Header';
import { Context } from '../../../../..';
import SettingService from '../../../../../Services/SettingService';
import AuthService from '../../../../../Services/AuthService';
const white = '#fff';
const defaultTheme = createTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[50] },
    background: { default: white },
  },
});

const SettingsPage = () => {
  const {store} = useContext(Context)
  const [theme, setTheme] = useState(defaultTheme);
  const [scheduleType, setScheduleType] = useState(store.user.schedulerType);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userData, setUserData] = useState(store.user);
  const [password, setPassword] = useState('')
  // Смена темы
  const toggleTheme = () => {
    const newTheme = createTheme({
      palette: {
        primary: { main: blue[theme.palette.primary.main === blue[700] ? 500 : 700] },
        secondary: { main: theme.palette.secondary.main === grey[50] ? grey[200] : grey[50] },
        background: { default: theme.palette.background.default === white ? grey[200] : white },
      },
    });
    setTheme(newTheme);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }
  const handleSheduleType = async (value) => {
    try {
      /* console.log(store.user) */
      const response = await SettingService.setSheduleType(value, store.user.id)
      if (response.status == 200) {
         setScheduleType(response.data.schedulerType)
         store.user.schedulerType = response.data.schedulerType
      }
    }
    catch (e) {
      alert('Ошибка в смене типа расписания')
    }
  }

  // Обновление данных пользователя
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Сохранение данных пользователя (возможно, с отправкой на сервер)
  const handleSave = () => {
    // Логика сохранения данных
    console.log("User data saved:", userData);
  };

  useEffect(() => {
    console.log(store.user)
  },[store])

  const handleSavePassword = async () => {
    try {
      if (validatePassword(password)) {
        const response = await AuthService.setPassword(store.user.id, password)
        if (response.status === 200) {
          setPassword('')
          alert("Пароль успешно сохранен");
        } else {
          alert("Ошибка сохранения пароля");
        }
      }
      else {
        alert("Пароль должен содержать от 4 до 20 символов");
      }
      
    }
    catch (e) {
      alert("Ошибка сохранения пароля");
    }
  }

  // Проверка пароля перед отправкой на сервер
  const validatePassword = (password) => {
    // Логика проверки пароля
    return password.length >= 4 && password.length <= 20;
    
  }
  return (
    <>
      <Header/>
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Настройки пользователя
          </Typography>

          <Grid container spacing={4} mt={7}>
            {/* Левая колонка */}
            <Grid item xs={12} md={6}>
              {/* Центрирование контента в колонке */}
              <Box sx={{ textAlign: 'center' }}>
                {/* Аватарка и кнопка для изменения */}
                <Avatar
                  src={userData.avatar}
                  alt="User Avatar"
                  sx={{ width: 180, height: 180, mb: 2, mx: 'auto' }}
                />
                <Button variant="contained" component="label" sx={{ mb: 4 }}>
                  Изменить аватар
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUserData((prevData) => ({
                          ...prevData,
                          avatar: URL.createObjectURL(file),
                        }));
                      }
                    }}
                  />
                </Button>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1"><strong>ФИО:</strong> {`${userData.secondName} ${userData.firstName} ${userData.patronomicName}` || 'Не указано'}</Typography>
                  <Typography variant="body1"><strong>Email:</strong> {userData.email || 'Не указано'}</Typography>
                  <Typography variant="body1"><strong>Телефон:</strong> {userData.phone || 'Не указано'}</Typography>
                  <Typography variant="body1"><strong>СНИЛС:</strong> {userData.snils || 'Не указано'}</Typography>
                  <Typography variant="body1">
                    <strong>Тип расписания:</strong> {scheduleType === 'byDate' ? 'По датам' : 'По дням недели'}
                  </Typography>
                  <Typography variant="body1"><strong>Специализация:</strong> {userData?.specialization || 'Не указано'}</Typography>
                  <Typography variant="body1">
                    <strong>Медицинская организация:</strong> {userData?.medicalOrganization || 'Не указано'}
                  </Typography>
                </Box>
                {/* Переключатели для настроек расписания и уведомлений */}
                <FormGroup sx={{ alignItems: 'left', ml: 2 }}>
                  <FormControl sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scheduleType === 'byDate'}
                          onChange={(e) =>
                            handleSheduleType(e.target.checked ? 'byDate' : 'daysOfWeek')
                            /* setScheduleType(e.target.checked ? 'byDate' : 'daysOfWeek') */
                          }
                        />
                      }
                      label="Использовать расписание по датам"
                    />
                  </FormControl>

                  <FormControl sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationsEnabled}
                          onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        />
                      }
                      label="Отправлять уведомления на почту"
                    />
                  </FormControl>
                </FormGroup>

                {/* Кнопка для смены темы */}
                {/* <Button
                  variant="outlined"
                  color="primary"
                  onClick={toggleTheme}
                  sx={{ mt: 2 }}
                >
                  Сменить тему
                </Button> */}
              </Box>
            </Grid>

            {/* Правая колонка */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Изменение данных пользователя
              </Typography>

              <Grid container spacing={2}>
                {/* Поле для смены пароля */}
                <Grid item xs={8}>
                  <TextField
                    label="Новый пароль"
                    type="password"
                    fullWidth
                    name="newPassword"
                    value={password}
                    onChange={handleChangePassword}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSavePassword}
                    sx={{ width: '100%', minHeight: '56px' }}
                  >
                    Сохранить 
                  </Button>
                </Grid>

                {/* Поле для изменения номера телефона */}
                <Grid item xs={12}>
                  <TextField
                    label="Номер телефона"
                    type="tel"
                    fullWidth
                    name="phoneNumber"
                    value={userData.phone}
                    onChange={handleUserDataChange}
                  />
                </Grid>

                {/* Поле для изменения email */}
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    name="email"
                    value={userData.email}
                    onChange={handleUserDataChange}
                  />
                </Grid>

                {/* Поле для других данных пользователя */}
                {/* Пример добавленного поля, можно добавить еще по необходимости */}
                <Grid item xs={12}>
                  <TextField
                    label="Другие данные"
                    fullWidth
                    name="otherInfo"
                    onChange={handleUserDataChange}
                  />
                </Grid>
              </Grid>

              {/* Кнопка Сохранить */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  disabled
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ width: '50%' }}
                >
                  Сохранить
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>

  );
};

export default SettingsPage;