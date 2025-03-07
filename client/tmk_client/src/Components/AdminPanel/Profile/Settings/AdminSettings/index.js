import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Avatar,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import Header from '../../../Header';

const white = '#fff';
const defaultTheme = createTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[50] },
    background: { default: white },
  },
});

const SettingsPage = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [scheduleType, setScheduleType] = useState('daysOfWeek');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userData, setUserData] = useState({
    password: '',
    phoneNumber: '',
    email: '',
    avatar: '',
  });

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

  return (
    <>
      <Header/>
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Настройки пользователя
          </Typography>

          <Grid container spacing={4}>
            {/* Левая колонка */}
            <Grid item xs={12} md={4}>
              {/* Аватарка и кнопка для изменения */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                  src={userData.avatar}
                  alt="User Avatar"
                  sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                />
                <Button variant="contained" component="label">
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
              </Box>

              {/* Переключатели для настроек расписания и уведомлений */}
              <FormGroup>
                <FormControl sx={{ mb: 3 }} component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scheduleType === 'byDate'}
                        onChange={(e) =>
                          setScheduleType(e.target.checked ? 'byDate' : 'daysOfWeek')
                        }
                      />
                    }
                    label="Использовать расписание по датам"
                  />
                </FormControl>

                <FormControl sx={{ mb: 3 }} component="fieldset">
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
              <Button
                variant="outlined"
                color="secondary"
                onClick={toggleTheme}
                fullWidth
              >
                Сменить тему
              </Button>
            </Grid>

            {/* Правая колонка */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Изменение данных пользователя
              </Typography>

              <Grid container spacing={2}>
                {/* Поле для смены пароля */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Пароль"
                    type="password"
                    fullWidth
                    name="password"
                    value={userData.password}
                    onChange={handleUserDataChange}
                  />
                </Grid>

                {/* Поле для изменения номера телефона */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Номер телефона"
                    type="tel"
                    fullWidth
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleUserDataChange}
                  />
                </Grid>

                {/* Поле для изменения email */}
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
        </Box>
      </ThemeProvider>
    </>

  );
};

export default SettingsPage;