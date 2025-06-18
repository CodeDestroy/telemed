import { useEffect, useState } from 'react';
/* import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; */
import Backdrop from '@mui/material/Backdrop';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BorderAllRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import AdminService from '../../../../Services/AdminService';
import PatientCreateModal from '../../Modals/Patients/Create';
import { DialogActions } from '@mui/material';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    borderRadius: '0.5rem',
    boxShadow: 24,
    p: 4,
  };
const CreateSlotModal = (props) => {

    
    const [patients, setPatients] = useState([]);
    const [inputPatientValue, setInputPatientValue] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null)

    
    const handleChangePatient = (event, newValue) => {
        setSelectedPatient(newValue)
    }

    const close = async () => {
        props.onHide()
    }

    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPatients()
        .then((data) => {
            setPatients(data)
            setSelectedPatient(data[0])
        })
    }, [])
    async function fetchPatients() {
        let response = await AdminService.getPatients()
        response.data.map((doc) => {
            doc.label = doc.secondName + " " + doc.firstName + " " + doc.patronomicName;
        })
        return response.data
    }
    const [openNewPatient, setOpenNewPatient] = useState(false);

    const handleCloseNewPatient = () => {setOpenNewPatient(false);};
    const handleOpenNewPatient = () => {setOpenNewPatient(true);};

    const handleSubmit = async () => {
        
        try {
            const datetimeStr = `${props.item.date}T${props.item.scheduleStartTime}`;
            const start = dayjs(`${props.item.date}T${props.item.scheduleStartTime}`);
            const end = dayjs(`${props.item.date}T${props.item.scheduleEndTime}`);
            const durationInMinutes = end.diff(start, 'minute');
            const response = await AdminService.createSlot(props.doctor, selectedPatient, dayjs(datetimeStr), durationInMinutes)
            if (response.status == 200) {
                alert('Успешно')
                window.location.reload();
            } else if (response.status === 500) {
                setError("Ошибка сервера: не удалось сохранить событие");
            } else {
                setError("Не удалось сохранить событие, попробуйте снова");
            }
    
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            setError("Произошла ошибка при отправке данных");
        }
    }

    if (props.open == true && props.item && props.doctor) {
        return (
            <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.open}
                onClose={props.onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={props.open}>
                    <Box sx={style}>
                        {error && error.length > 0 ? (
                            <Typography id="transition-modal-title" variant="h5" component="h2" sx={{color: 'red'}}>
                                {error}
                            </Typography>
                        ) : ('')}
                        <Typography id="transition-modal-title" variant="h5" component="h2">
                            Создать консультацию на {dayjs(props.item.date).format('DD.MM.YYYY')} {props.item.scheduleStartTime.slice(0, 5)}
                        </Typography>
                        <Autocomplete
                            disablePortal
                            options={patients}
                            sx={{ mt: 2 }}
                            renderInput={(params) => <TextField key={`doctor_${params.id}`} {...params} label="Пациент" />}
                            getOptionLabel={(option) => option.secondName + ' ' + option.firstName + ' (' + option.snils + ')' || ""}
                            value={selectedPatient}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={handleChangePatient}
                            inputValue={inputPatientValue}
                            onInputChange={(event, newInputValue) => {
                                setInputPatientValue(newInputValue);
                            }}
                        />
                        <p style={{fontSize: '0.8rem'}}>
                            Нет нужного пациента?
                            <a onClick={handleOpenNewPatient} style={{color: '#d30d15', cursor: 'pointer' }} rel="noopener noreferrer">Добавить</a>
                        </p>
                        <DialogActions>
                            <Button onClick={props.onClose}>Отмена</Button>
                            <Button onClick={handleSubmit}>Сохранить</Button>
                        </DialogActions>
                    </Box>
                </Fade>
                
            </Modal>
            <PatientCreateModal show={openNewPatient} onHide={() => setOpenNewPatient(false)} />
            </>
        );
    }
}

export default CreateSlotModal;
