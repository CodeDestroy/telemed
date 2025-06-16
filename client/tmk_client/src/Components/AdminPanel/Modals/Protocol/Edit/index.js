import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import DoctorService from '../../../../../Services/DoctorService'; // Путь к вашему сервису
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    minWidth: 600, // увеличено с 450 до 700
    maxWidth: '75vw', // чтобы не выходило за пределы экрана
    width: '100%',
};

const EditProtocolModal = ({ consultation, isOpen, onClose }) => {
    const [text, setText] = useState(consultation.protocol || '');
    const [openSaveSnackbar, setOpenSaveSnackbar] = useState(false);
    const [openSendSnackbar, setOpenSendSnackbar] = useState(false);

    useState(() => {
        if (consultation) {
            console.log(consultation);
        }
    }, [consultation]);

    const handleSave = async () => {
        // Логика сохранения
        // Например: отправить text и id на сервер
        console.log(text)
        try {
            const data = await DoctorService.setProtocol(consultation.roomId, text);
            console.log(data);
            consultation.protocol = text; // Обновляем протокол в consultation
        }
        catch (e) {
            console.log(e);
        }
        setOpenSaveSnackbar(true);
    };

    const handleSend = async () => {
        // Логика отправки протокола
        // Например: отправить text и id на сервер с другим статусом
        try {

            const data = await DoctorService.sendProtocol(consultation.roomId);
            console.log(data); // Обновляем протокол в consultation
            setOpenSendSnackbar(true);
        }
        catch (e) {
            console.log(e)
        }
    };

    // Функция для форматирования даты с помощью dayjs
    const formatMeetingStart = (dateString) => {
        if (!dateString) return '';
        return dayjs(dateString).format('HH:mm DD.MM.YYYY');
    };

    return (
        <>
            <Modal open={isOpen} onClose={onClose}>
                <>
                    <Box sx={style}>
                        <Typography variant="h6" mb={2}>Редактировать протокол</Typography>
                        <Typography variant="body2" mb={2}>
                            Протокол консультации с пациентом: 
                            {consultation.pSecondName} {consultation.pFirstName} {consultation.pPatronomicName}
                        </Typography>
                        <Typography variant="body2" mb={2}>
                            От: {formatMeetingStart(consultation.meetingStart)}
                        </Typography>
                        <TextField
                            label="Текст протокола"
                            multiline
                            fullWidth
                            minRows={6}
                            maxRows={15}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Сохранить
                            </Button>
                            <Button variant="contained" color="success" onClick={handleSend}>
                                Отправить протокол
                            </Button>
                            <Button variant="outlined" onClick={onClose}>
                                Закрыть
                            </Button>
                        </Stack>
                        
                    </Box>
                    <Snackbar
                        open={openSaveSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSaveSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setOpenSaveSnackbar(false)} severity="success" sx={{ width: '100%', zIndex: 10000 }}>
                            Протокол успешно сохранён!
                        </Alert>
                        
                    </Snackbar>
                    <Snackbar
                        open={openSendSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSendSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setOpenSendSnackbar(false)} severity="success" sx={{ width: '100%', zIndex: 10000 }}>
                            Протокол успешно отправлен!
                        </Alert>
                    </Snackbar>
                </>
                
            </Modal>
            
            
        </>
    );
};

export default EditProtocolModal;