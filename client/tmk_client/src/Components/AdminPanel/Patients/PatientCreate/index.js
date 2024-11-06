import SubMenu from '../../../SubMenu';
import Header from '../../Header';
import menuItems from '../../../SubMenu/AdminPatientManagmentSub';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { Container, TextField, Button, Box, IconButton, InputAdornment, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff, FileCopy } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import AdminService from '../../../../Services/AdminService';

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

const PatientCreate = () => {
    const [password, setPassword] = useState(generatePassword());
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [secondName, setSecondName] = useState('')
    const [name, setName] = useState('')
    const [patrinomicName, setPatronomicName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [info, setInfo] = useState('')
    const [error, setError] = useState('')

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };
    
    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };
    
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('secondName', secondName);
        formData.append('name', name);
        formData.append('patrinomicName', patrinomicName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('password', password);
        try {

            formData.append('birthDate', birthDate ? birthDate.toISOString() : '');
        }
        catch (e) {
            setError('Неверная дата рождения')
            return
        }
        formData.append('info', info);
        if (avatar) {
            formData.append('avatar', avatar);
        }
        // Здесь должна быть логика создания нового пациента
        try {
            const response = await AdminService.createPatient(formData)

            if (response.status !== 500) {
                setSaved(true);
                
                setSecondName('')
                
                setName('')
                setPatronomicName('')
                setPhone('')
                setEmail('')
                setPassword('')
                setBirthDate(null)
                setInfo('')
                setAvatar(null)
                setError('')
                /* console.log('Создано') */
            }
            else {
                /* console.log('Ошибка', response.data) */
            }
        }
        catch (e) {
            /* console.log(e) */
            setError(e.response.data);
        }
        
    };

    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleClickCopy = (event, url) => {
        navigator.clipboard.writeText(url).then(() => {
            setOpen(true);
        }, (err) => {
            console.error('Невозможно скопировать текст: ', err);
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSecondNameChange = (event) => {
        setSecondName(event.target.value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handlePatronomicNameChange = (event) => {
        setPatronomicName(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleInfoChange = (event) => {
        setInfo(event.target.value);
    }

    const [saveOpen, setSaveOpen] = React.useState(false);

    const handleClick = () => {
        setSaveOpen(true);
    };
    
    const handleSaveClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSaveOpen(false);
    };

    const handleUndoSave = () => {
        setSaveOpen(false);
    }

    const savedAction = (
        <React.Fragment>
            {/* <Button color="secondary" size="small" onClick={handleSaveClose}>
                Отмена (не работает)
            </Button> */}
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSaveClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            <Header/>
            <SubMenu menuItems={menuItems} />
            <Container>
                <h2>Создать пациента</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {error?.length > 0 ? <h4>{error}</h4> : ''}
                    <TextField label="Фамилия" variant="outlined" fullWidth value={secondName} onChange={handleSecondNameChange}/>
                    <TextField label="Имя" variant="outlined" fullWidth value={name} onChange={handleNameChange}/>
                    <TextField label="Отчество" variant="outlined" fullWidth value={patrinomicName} onChange={handlePatronomicNameChange}/>
                    <TextField label="Номер телефона" variant="outlined" fullWidth value={phone} onChange={handlePhoneChange}/>
                    <TextField label="Email" variant="outlined" fullWidth value={email} onChange={handleEmailChange}/>
                    <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <DatePicker
                            label="Дата рождения"
                            value={birthDate}
                            onChange={(newValue) => setBirthDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            disableFuture 
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(newValue) => setPassword(newValue.target.value)}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handlePasswordToggle}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <IconButton onClick={event => handleClickCopy(event, password)}>
                                    <FileCopy />
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained" onClick={() => setPassword(generatePassword())}>
                        Сгенерировать пароль
                    </Button>
                    <TextField
                        label="Дополнительная информация"
                        type='text'
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={info}
                        onChange={handleInfoChange}
                        /* onChange={(newValue) => setInfo(newValue)} */
                    />
                    <Button variant="contained" component="label">
                        Загрузить аватарку
                    <input type="file" hidden onChange={handleAvatarChange} />
                    </Button>
                    {avatar && <p>Загружен файл: {avatar.name}</p>}
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Создать
                    </Button>
                </Box>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open}
                    autoHideDuration={800}
                    onClose={handleClose}
                    message="Скопировано"
                />
                <Snackbar
                    open={saved}
                    autoHideDuration={6000}
                    onClose={handleSaveClose}
                    message="Успешно создано"
                    action={savedAction}
                />
            </Container>
        </>
    );
};
        
export default PatientCreate;
        
