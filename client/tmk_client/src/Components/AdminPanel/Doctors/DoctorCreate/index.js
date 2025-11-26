import SubMenu from '../../../SubMenu';
import Header from '../../Header';
import menuItems from '../../../SubMenu/AdminDoctorManagmentSub';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useContext, useEffect } from 'react';
import { Container, TextField, Button, Box, IconButton, InputAdornment, Snackbar, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { Visibility, VisibilityOff, FileCopy } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Context } from '../../../..';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import AdminService from '../../../../Services/AdminService';

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

const DoctorCreate = () => {
    const { store } = useContext(Context);
    const [password, setPassword] = useState(generatePassword());
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [secondName, setSecondName] = useState('')
    const [name, setName] = useState('')
    const [patrinomicName, setPatronomicName] = useState('')
    const [inn, setInn] = useState('')
    const [snils, setSnils] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [info, setInfo] = useState('')
    const [error, setError] = useState('')
    // --- Вместо одного поста ---
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);

    const [specialties, setSpecialties] = useState([]);
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };
    
    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };
    useEffect(() => {
        if (store?.user?.id) {
            async function fetchSpecialties() {
                try {
                    const response = await AdminService.getSpecialties()
                    setSpecialties(response.data)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchSpecialties();
        }
    }, [store]);
    
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('secondName', secondName);
        formData.append('name', name);
        formData.append('patrinomicName', patrinomicName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('inn', inn);
        formData.append('snils', snils);
        formData.append('password', password);

        try {
            formData.append('birthDate', birthDate ? birthDate.toISOString() : '');
        } catch (e) {
            setError('Неверная дата рождения');
            return;
        }

        formData.append('info', info);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        // 👇 Теперь добавляем несколько специальностей
        const postIds = selectedSpecialties.map(s => s.id);
        formData.append('postIds', JSON.stringify(postIds));

        try {
            const response = await AdminService.createDoctor(formData, store.selectedProfile.id);
            if (response.status !== 500) {
                setSaved(true);
                // Очистим всё после успешного сохранения
                setSecondName('');
                setName('');
                setPatronomicName('');
                setPhone('');
                setEmail('');
                setPassword(generatePassword());
                setInn('');
                setSnils('');
                setBirthDate(null);
                setInfo('');
                setAvatar(null);
                setSelectedSpecialties([]);
                setError('');
            } else {
            console.log('Ошибка', response.data);
            }
        } catch (e) {
            console.log(e.response);
            setError(e.response.data);
        }
    };



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

    const handleInnChange  = (event) => {
        setInn(event.target.value)
    }

    const handleSnilsChange  = (event) => {
        setSnils(event.target.value)
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
                <h2>Создать врача</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {error?.length > 0 ? <h4 style={{color: 'red'}}>{error.split('\n').map(str => <div>{str}</div>)}</h4> : ''}
                    <TextField label="Фамилия" variant="outlined" fullWidth value={secondName} onChange={handleSecondNameChange}/>
                    <TextField label="Имя" variant="outlined" fullWidth value={name} onChange={handleNameChange}/>
                    <TextField label="Отчество" variant="outlined" fullWidth value={patrinomicName} onChange={handlePatronomicNameChange}/>
                    <TextField label="Номер телефона" variant="outlined" fullWidth value={phone} onChange={handlePhoneChange}/>
                    <TextField label="Email" variant="outlined" fullWidth value={email} onChange={handleEmailChange}/>
                    {/* <TextField label="Инн" variant="outlined" fullWidth value={inn} onChange={handleInnChange}/> */}
                    <TextField label="СНИЛС" variant="outlined" fullWidth value={snils} onChange={handleSnilsChange}/>
                    <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="ru"> 
                        <DatePicker
                            label="Дата рождения"
                            value={birthDate}
                            onChange={(newValue) => setBirthDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            disableFuture 
                        />
                    </LocalizationProvider>
                    {/* <FormControl fullWidth>
                        <InputLabel id="specialty-select-label">Специальность</InputLabel>
                        <Select
                            labelId="specialty-select-label"
                            value={selectedSpecialty.id || ''}
                            label="Специальность"
                            onChange={(e) => {
                                const selected = specialties.find(s => s.id === e.target.value);
                                setSelectedSpecialty(selected);
                            }}
                        >
                            {specialties.map((spec) => (
                                <MenuItem key={spec.id} value={spec.id}>
                                    {spec.postName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    <FormControl fullWidth>
                        <InputLabel id="specialty-select-label">Специальности</InputLabel>
                        <Select
                            labelId="specialty-select-label"
                            multiple
                            value={selectedSpecialties.map(s => s.id)}
                            label="Специальности"
                            onChange={(e) => {
                            const selectedIds = e.target.value;
                            const selected = specialties.filter(s => selectedIds.includes(s.id));
                            setSelectedSpecialties(selected);
                            }}
                            renderValue={(selected) =>
                            specialties
                                .filter(s => selected.includes(s.id))
                                .map(s => s.postName)
                                .join(", ")
                            }
                        >
                            {specialties.map((spec) => (
                                <MenuItem key={spec.id} value={spec.id}>
                                    {spec.postName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
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
        
export default DoctorCreate;
        
