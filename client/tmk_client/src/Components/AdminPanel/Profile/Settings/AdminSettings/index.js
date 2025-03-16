import React, { useState, useContext } from 'react';
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
import AuthService from '../../../../../Services/AuthService';

import { Context } from '../../../../..';
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
  const [scheduleType, setScheduleType] = useState('daysOfWeek');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
    const [password, setPassword] = useState('')
  const [userData, setUserData] = useState(store.user);


  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

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
                {/* <FormControl sx={{ mb: 3 }} component="fieldset">
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
                </FormControl> */}

                <FormControl sx={{ mb: 3 }} component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                      
                        /* checked={notificationsEnabled} */
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      />
                    }
                    disabled
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
                disabled
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
                    label="Новый пароль"
                    type="password"
                    fullWidth
                    name="newPassword"
                    value={password}
                    onChange={handleChangePassword}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSavePassword}
                    sx={{ width: '50%' }}
                  >
                    Сохранить
                  </Button>
                </Grid>
                

                {/* Поле для изменения номера телефона */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Номер телефона"
                    type="tel"
                    fullWidth
                    name="phone"
                    value={userData.phone}
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
                    name="info"
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
        </Box>
      </ThemeProvider>
    </>

  );
};

export default SettingsPage;