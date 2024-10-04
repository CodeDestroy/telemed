import React, {useEffect, useContext, useState} from 'react'
import Header from '../../Header'
import menuItems from '../../../SubMenu/AdminSlotManagmentSub'
import SubMenu from '../../../SubMenu'
import { Context } from '../../../..';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Autocomplete, Container, Grid, Typography, Button, Snackbar, IconButton } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers/locales';
import AdminService from '../../../../Services/AdminService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IntegrationService from '../../../../Services/IntegrationService';

function CreateSlot() {
    const russianLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
    const { store } = useContext(Context);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [slotStartDateTime, setSlotStartDateTime] = useState(dayjs(new Date()));
    const [duration, setDuration] = useState(30);

    const [saved, setSaved] = useState(false);

    const [sched, setSched] = useState([])

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchDoctors() {
                try {
                    const response = await AdminService.getDoctors();
                    setDoctors(response.data)

                } 
                catch (e) {
                    console.log(e);
                }
            }
            async function fetchPatients() {
                try {
                    const response = await AdminService.getPatients();
                    setPatients(response.data)
                    /* console.log(response.data) */
                } 
                catch (e) {
                    console.log(e);
                }
            }
            /* async function fetchSched () {
                try {
                    const data = await IntegrationService.getOnlineSched()
                    setSched(data.data)
                    console.log(data.data)
                }
                catch (e) {
                    console.log(e)
                }
            } */
        
            /* fetchSched(); */
            fetchPatients();
            fetchDoctors()
        }
    }, [store]);

    const saveSlot = async () => {
        try {
            const response = await  AdminService.createSlot(selectedDoctor, selectedPatient, slotStartDateTime, duration)
            if (response.status !== 500) {
                setSaved(true);
            }
            else {
                console.log('Ошибка', response.data)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleSaveClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSaved(false);
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    }

    const savedAction = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleSaveClose}>
                Отмена (не работает)
            </Button>
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
                <Typography variant="h4" gutterBottom>
                    Создать слот
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={doctors}
                            getOptionLabel={(option) => `${option.secondName} ${option.firstName} ${option.info}`}
                            renderInput={(params) => <TextField {...params} label="Выберите врача" />}
                            value={selectedDoctor}
                            onChange={(event, newValue) => setSelectedDoctor(newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={patients}
                            getOptionLabel={(option) => `${option.secondName} ${option.firstName} ${option.birthDate}`}
                            renderInput={(params) => <TextField {...params} label="Выберите пациента" />}
                            value={selectedPatient}
                            onChange={(event, newValue) => setSelectedPatient(newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocale}>
                            <DateTimePicker
                                label="Начало слота"
                                value={slotStartDateTime}
                                defaultValue={slotStartDateTime} 
                                onChange={(newValue) => setSlotStartDateTime(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, ml: 0 }}>
                            <InputLabel id="demo-simple-select-helper-label">Продолжительность</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={duration}
                                label="Продолжительность"
                                onChange={handleDurationChange}
                            >
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={45}>45</MenuItem>
                                <MenuItem value={60}>60</MenuItem>
                            </Select>
                            <FormHelperText>Продолжительность конференции</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" onClick={saveSlot}>
                            Создать слот
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    open={saved}
                    autoHideDuration={6000}
                    onClose={handleSaveClose}
                    message="Успешно создано"
                    action={savedAction}
                />
                
            </Container>
        </>
        
    )
}

export default CreateSlot