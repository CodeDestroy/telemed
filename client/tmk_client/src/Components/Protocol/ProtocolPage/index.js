import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientService from '../../../Services/PatientService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Container, Paper, Box, Typography, IconButton, Tooltip, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import moment from "moment-timezone";
import DoctorService from "../../../Services/DoctorService";

// Пример функции для запроса данных протокола




const ProtocolPage = () => {
    // Получаем roomName из URL
    let params = useParams()
    const roomName = params.protocolId;
    const [slot, setSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!roomName) return;
        setLoading(true);
        setError('');
        fetchProtocol(roomName)
            .then(data => {
                setSlot(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Ошибка');
                setLoading(false);
            });
    }, [roomName]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const fetchProtocol = async (roomName) => {
        try {
            const response = await PatientService.getSlotByRoomName(roomName);
            console.log(response)
            if (response.status !== 200) {
                throw new Error('Ошибка получения протокола');
            }
            return response.data;
        }
        catch (error) {
            alert(error.message);
        }
    }

    if (loading) return <div>Загрузка протокола...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!slot?.Room?.protocol) return <div>Протокол не найден</div>;

    // Импортируем jsPDF и html2canvas

    const handleDownloadProtocol = async () => {
        setDownloading(true);
        try {
            const response = await DoctorService.downloadProtocol(slot.id);
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Протокол_${slot.Patient.secondName}_${moment(slot.slotStartDateTime).format("DD.MM.YYYY")}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setSnackbar({ open: true, message: "Протокол успешно скачан", severity: "success" });
        } catch (error) {
            setSnackbar({ open: true, message: "Ошибка при скачивании PDF", severity: "error" });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    {/* <Tooltip title="Экспорт в PDF">
                        <Box
                            component="span"
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mx: 3 }}
                            onClick={handleExportPDF}
                        >
                            Экспорт в PDF&nbsp;
                            <IconButton
                                sx={{
                                    bgcolor: '#d32f2f',
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#b71c1c' }
                                }}
                                size="large"
                            >
                                <PictureAsPdfIcon />
                            </IconButton>
                        </Box>
                    </Tooltip> */}
                    <Tooltip title="Скачать PDF протокол">
                        <span>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={handleDownloadProtocol}
                                disabled={downloading}
                            >
                                {downloading ? "Загрузка..." : "Скачать PDF"}
                            </Button>
                        </span>
                    </Tooltip>
                    
                </Box>
                <Box
                    id="protocol-pdf-content"
                >
                    <Typography variant="h5" fontWeight={600} id="protocol-title" sx={{ mb: 2, mx: 3 }}>
                        Протокол конференции: {roomName}
                    </Typography>
                    <Box
                        id="protocol-content"
                        sx={{
                            background: '#f9f9fb',
                            borderRadius: 2,
                            p: 3,
                            minHeight: 200,
                            fontFamily: 'monospace',
                            fontSize: 16,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}
                    >
                        {typeof slot.Room.protocol === 'object'
                            ? <pre style={{ margin: 0 }}>{JSON.stringify(slot.Room.protocol, null, 2)}</pre>
                            : slot.Room.protocol}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProtocolPage;