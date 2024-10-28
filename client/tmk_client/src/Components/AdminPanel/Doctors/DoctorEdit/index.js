import React, { useEffect, useContext, useState } from 'react';
import { Container, TextField, Button, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import SubMenu from '../../../SubMenu';
import menuItems from '../../../SubMenu/AdminPatientManagmentSub';
import { Context } from '../../../..';
import AdminService from '../../../../Services/AdminService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import LoadingScreen from '../../../Loading';

const DoctorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [doctor, setDoctor] = useState(null);
    const handleSave = () => {
        console.log(doctor)
      // Здесь должна быть логика сохранения изменений
        /* navigate('/doctors'); */
    };

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchDoctor() {
                try {
                    const response = await AdminService.getDoctor(id)
                    let array = response.data

                    setDoctor(array);

                } catch (e) {
                    console.log(e);
                }
            }
            fetchDoctor();
        }
    }, [store]);

    const setBirthDate = (event) => {
        setDoctor({...doctor, birthDate: event.target.value });
    }
    const setName = (event) => {
        setDoctor({...doctor, firstName: event.target.value });
    }
    const setSecondName = (event) => {
        setDoctor({...doctor, secondName: event.target.value });
    }
    const setPatronomicName = (event) => {
        setDoctor({...doctor, 'patronomicName': event.target.value });
    }
    const handleSnilsChange = (event) => {
        setDoctor({...doctor, snils: event.target.value });
    }
    const handleConfirmed = (event) => {
        setDoctor({...doctor, user: { 
           ...doctor.user, 
           confirmed: !doctor.user.confirmed
        }})
    }
    const setPhone = (event) => {
        setDoctor({...doctor, user: { 
            ...doctor.user, 
            phone: event.target.value
        }})
    }
    const setEmail = (event) => {
        setDoctor({...doctor, user: { 
            ...doctor.user, 
            email: event.target.value
        }})
    }

    


return (
    <>
        <Header/>
        {/* <SubMenu menuItems={menuItems} /> */}
        {doctor ?
            <Container>
                <h2 style={{margin: '2rem 0'}}>Редактировать врача {doctor.secondName} {doctor.firstName}</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Фамилия" variant="outlined" fullWidth value={doctor.secondName} onChange={setName}/>
                        <TextField label="Имя" variant="outlined" fullWidth value={doctor.firstName} onChange={setSecondName}/>
                        <TextField label="Отчество" variant="outlined" fullWidth value={doctor.patronomicName} onChange={setPatronomicName}/>
                        {/* <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <DatePicker
                                label="Дата рождения"
                                value={patient.birthDate}
                                onChange={(event) => setBirthDate(event)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider> */}
                        <TextField label="Телефон" variant="outlined" fullWidth value={doctor.user.phone} onChange={setPhone}/>
                        <TextField label="СНИЛС" variant="outlined" fullWidth value={doctor.snils} onChange={handleSnilsChange}/>
                        <TextField label="Email" variant="outlined" fullWidth value={doctor.user.email} onChange={setEmail}/>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={doctor.user.confirmed}
                                    onChange={handleConfirmed}
                                    inputProps={{ 'aria-label': 'controlled' }} 
                                />
                            } 
                                label="Подтверждён" />
                        </FormGroup>

                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Сохранить
                        </Button>
                </Box>
            </Container>
        :
        <LoadingScreen/>
        }
    </>
    
);
};

export default DoctorEdit;
