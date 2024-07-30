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

const PatientEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [patient, setPatient] = useState(null);
    const handleSave = () => {
      // Здесь должна быть логика сохранения изменений
      navigate('/patients');
    };

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchPatient() {
                try {
                    const response = await AdminService.getPatient(id)
                    let array = response.data

                    setPatient(array);

                } catch (e) {
                    console.log(e);
                }
            }
            fetchPatient();
        }
    }, [store]);

    useEffect(() => {
        if (patient)
            console.log(patient)
    }, [patient])

    const setBirthDate = (event) => {
        setPatient({...patient, birthDate: event.target.value });
    }
    const setName = (event) => {
        setPatient({...patient, firstName: event.target.value });
    }
    const setSecondName = (event) => {
        setPatient({...patient, secondName: event.target.value });
    }
    const setPatronomicName = (event) => {
        setPatient({...patient, 'patronomicName': event.target.value });
    }
    const handleConfirmed = (event) => {
        setPatient({...patient, user: { 
           ...patient.user, 
           confirmed: !patient.user.confirmed
        }})
    }
    const setPhone = (event) => {
        setPatient({...patient, user: { 
            ...patient.user, 
            phone: event.target.value
         }})
    }
    const setEmail = (event) => {
        setPatient({...patient, user: { 
            ...patient.user, 
            email: event.target.value
         }})
    }

    


return (
    <>
        <Header/>
        {/* <SubMenu menuItems={menuItems} /> */}
        {patient ?
            <Container>
                <h2 style={{margin: '2rem 0'}}>Редактировать пациента {patient.secondName} {patient.firstName}</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Фамилия" variant="outlined" fullWidth value={patient.secondName} onChange={setName}/>
                        <TextField label="Имя" variant="outlined" fullWidth value={patient.firstName} onChange={setSecondName}/>
                        <TextField label="Отчество" variant="outlined" fullWidth value={patient.patronomicName} onChange={setPatronomicName}/>
                        {/* <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <DatePicker
                                label="Дата рождения"
                                value={patient.birthDate}
                                onChange={(event) => setBirthDate(event)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider> */}
                        <TextField label="Телефон" variant="outlined" fullWidth value={patient.user.phone} onChange={setPhone}/>
                        <TextField label="Email" variant="outlined" fullWidth value={patient.user.email} onChange={setEmail}/>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={patient.user.confirmed}
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

export default PatientEdit;
