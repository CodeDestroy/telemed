import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientService from '../../../Services/PatientService';

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

    return (
        <div>
            <h3>Протокол конференции: {roomName}</h3>
            {/* Пример отображения данных протокола */}
            <pre style={{ background: '#f5f5f5', padding: 16 }}>
                {protocol}
            </pre>
        </div>
    );
};

export default ProtocolPage;