import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientService from '../../../Services/PatientService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Container, Paper, Box, Typography, IconButton, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Пример функции для запроса данных протокола




const ProtocolPage = () => {
    // Получаем roomName из URL
    let params = useParams()
    const roomName = params.protocolId;
    const [protocol, setProtocol] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!roomName) return;
        setLoading(true);
        setError('');
        fetchProtocol(roomName)
            .then(data => {
                setProtocol(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Ошибка');
                setLoading(false);
            });
    }, [roomName]);

    const fetchProtocol = async (roomName) => {
        try {
            const response = await PatientService.getProtocol(roomName);
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
    if (!protocol) return <div>Протокол не найден</div>;

    // Импортируем jsPDF и html2canvas

    const handleExportPDF = async () => {
        const input = document.getElementById('protocol-pdf-content');
        if (!input) return;
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`protocol_${roomName}.pdf`);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Tooltip title="Экспорт в PDF">
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
                        {typeof protocol === 'object'
                            ? <pre style={{ margin: 0 }}>{JSON.stringify(protocol, null, 2)}</pre>
                            : protocol}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProtocolPage;