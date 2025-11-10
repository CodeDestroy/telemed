import React, { useEffect, useContext, useState } from 'react';
import { Container, TextField, Button, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import SubMenu from '../../../SubMenu';
import menuItems from '../../../SubMenu/AdminPatientManagmentSub';
import { Context } from '../../../..';
import AdminService from '../../../../Services/AdminService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
/* import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import LoadingScreen from '../../../Loading';
import adminLocations from '../../../../Locations/AdminLocations';
import SchedulerService from '../../../../Services/SchedulerService'
import {
    Grid,
    Typography,
    Modal,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,

} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import DoctorService from '../../../../Services/DoctorService';
import { blue, grey, red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import AddIcon from '@mui/icons-material/Add';
import {ru} from 'date-fns/locale/ru';
import { format } from 'date-fns';
const white = '#fff'
const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const defaultTheme = createTheme({
    palette: {
      primary: {
        main: blue[700],
      },
      secondary: {
        main: grey[50],
      },
      background: {
        default: white,
      },
    },
});
  
const DoctorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [doctor, setDoctor] = useState(null);
    const [schedule, setSchedule] = useState({
        Понедельник: [],
        Вторник: [],
        Среда: [],
        Четверг: [],
        Пятница: [],
        Суббота: [],
        Воскресенье: [],
    });
    const [permissions, setPermissions] = useState([]); // Все возможные роли
    const [selectedPermissions, setSelectedPermissions] = useState([]); // Роли врача
    const [roleError, setRoleError] = useState(null);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Понедельник');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [theme, setTheme] = useState(defaultTheme);
    const [error, setError] = useState(null)
    const [specialties, setSpecialties] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);


    const handleSave = async () => {
        try {
            const postIds = doctor.Posts?.map(p => p.id) || [];

            const response = await AdminService.editDoctor(id, {
                ...doctor,
                postIds, // 👈 добавляем массив id специальностей
            });

            if (response.status === 200) {
                window.location = adminLocations.doctorManagement;
            } else {
                setError(response.data.message);
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Ошибка при сохранении');
        }
    };


    useEffect(() => {
        if (store?.user?.id) {
            async function fetchDoctor() {
                try {
                    const response = await AdminService.getDoctor(id)

                    setDoctor(response.data);
                   

                } catch (e) {
                    console.log(e);
                }
            }

            async function fetchSpecialties() {
                try {
                    const response = await AdminService.getSpecialties()
                    setSpecialties(response.data)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchSpecialties();
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
        setDoctor({...doctor, User: { 
           ...doctor.User, 
           confirmed: !doctor.User.confirmed
        }})
    }
    const setPhone = (event) => {
        console.log(event.target)
        setDoctor({...doctor, User: { 
            ...doctor.User, 
            phone: event.target.value
        }})
    }
    const setEmail = (event) => {
        setDoctor({...doctor, User: { 
            ...doctor.User, 
            email: event.target.value
        }})
    }

    
    useEffect(() => {
        async function fetchPermissions() {
            try {
                setRolesLoading(true);
                const [allPerms, doctorPerms] = await Promise.all([
                    AdminService.getPermissions(), // все роли
                    AdminService.getDoctorPermissions(id), // роли конкретного врача
                ]);

                setPermissions(allPerms.data);
                setSelectedPermissions(doctorPerms.data.map(p => p.id));
            } catch (e) {
                console.log(e);
                setRoleError('Не удалось загрузить роли');
            } finally {
                setRolesLoading(false);
            }
        }

        if (store?.user?.id) fetchPermissions();
    }, [store, id]);

    const handleTogglePermission = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSaveRoles = async () => {
        try {
            const response = await AdminService.updateDoctorPermissions(id, selectedPermissions);
            if (response.status === 200) {
                alert('Роли успешно сохранены');
            } else {
                setRoleError(response.data.message || 'Ошибка при сохранении ролей');
            }
        } catch (e) {
            setRoleError(e.response?.data?.message || 'Ошибка при сохранении ролей');
        }
    };

    
    // Добавление временного интервала
    const handleAddSlot = async () => {
        /* console.log(startTime, endTime, selectedDay, store.user.personId) */
        try {
            const response = await DoctorService.createScheduler(doctor.id, selectedDay, startTime, endTime)
            /* const response = {status: 201} */
            if (response.status == 201) {
                if (startTime && endTime && selectedDay) {
                    setSchedule({
                        ...schedule,
                        [selectedDay]: [...schedule[selectedDay], { start: format(startTime, 'HH:mm'), end: format(endTime, 'HH:mm'), id: response.data.id }],
                    });
                    /* await handleShowSlot(format(startTime, 'HH:mm'), format(endTime, 'HH:mm'), selectedDay) */
                }
                handleCloseModal();
            }
            else {
                alert('Ошибка')
            }
        }
        catch (e) {
            alert(e.response.data.error)
        }
        
        
        
    };

    const minDate = new Date();
    minDate.setHours(8);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);

    const maxDate = new Date();
/*     maxDate.setDate(maxDate); */
    maxDate.setHours(21);
    maxDate.setMinutes(1);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);
return (
    <>
        <Header/>
        {/* <SubMenu menuItems={menuItems} /> */}
        {doctor ?
            <Container>
                <h2 style={{margin: '2rem 0'}}>Редактировать врача {doctor.secondName} {doctor.firstName}</h2>
                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {error?.length > 0 && error ? <h4 style={{color: 'red'}}>{error}</h4> : ''}
                        <TextField label="Фамилия" variant="outlined" fullWidth value={doctor.secondName} onChange={setSecondName}/>
                        <TextField label="Имя" variant="outlined" fullWidth value={doctor.firstName} onChange={setName}/>
                        <TextField label="Отчество" variant="outlined" fullWidth value={doctor.patronomicName} onChange={setPatronomicName}/>
                        <TextField label="Телефон" variant="outlined" fullWidth value={doctor.User.phone} onChange={setPhone}/>
                        <TextField label="СНИЛС" variant="outlined" fullWidth value={doctor.snils} onChange={handleSnilsChange}/>
                        <TextField label="Email" variant="outlined" fullWidth value={doctor.User.email} onChange={setEmail}/>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={doctor.User.confirmed}
                                    onChange={handleConfirmed}
                                    inputProps={{ 'aria-label': 'controlled' }} 
                                />
                            } 
                                label="Подтверждён" />
                        </FormGroup>
                        <FormControl fullWidth>
                            <InputLabel id="specialty-select-label">Специальности</InputLabel>
                            <Select
                                labelId="specialty-select-label"
                                multiple
                                value={doctor.Posts?.map(p => p.id) || []}
                                label="Специальности"
                                onChange={(e) => {
                                const selectedIds = e.target.value;
                                const selected = specialties.filter(s => selectedIds.includes(s.id));
                                setDoctor({
                                    ...doctor,
                                    Posts: selected,
                                });
                                }}
                                renderValue={(selected) =>
                                specialties
                                    .filter((s) => selected.includes(s.id))
                                    .map((s) => s.postName)
                                    .join(', ')
                                }
                            >
                                {specialties.map((spec) => (
                                <MenuItem key={spec.id} value={spec.id}>
                                    {spec.postName}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Роли и права доступа
                            </Typography>

                            {rolesLoading ? (
                                <Typography>Загрузка...</Typography>
                            ) : roleError ? (
                                <Typography color="error">{roleError}</Typography>
                            ) : (
                                <FormGroup>
                                    {permissions.map((perm) => (
                                        <FormControlLabel
                                            key={perm.id}
                                            control={
                                                <Checkbox
                                                    checked={selectedPermissions.includes(perm.id)}
                                                    onChange={() => handleTogglePermission(perm.id)}
                                                />
                                            }
                                            label={perm.description || perm.name}
                                        />
                                    ))}
                                </FormGroup>
                            )}

                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 2 }}
                                onClick={handleSaveRoles}
                            >
                                Сохранить роли
                            </Button>
                        </Box>



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
