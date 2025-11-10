import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import doctorLocations from '../../../../../Locations/DoctorLocations';
import { Context } from '../../../../..';
import { hasPermission } from '../../../../Utils/permissions';

function DoctorButtons() {
    const { store } = useContext(Context);
    const [profileLoaded, setProfileLoaded] = useState(false);

    useEffect(() => {
        // Когда selectedProfile загружен — отмечаем это
        if (store.selectedProfile) {
            setProfileLoaded(true);
        }
    }, [store.selectedProfile]);

    const handleConsultations = () => {
        window.location.href = doctorLocations.consultations;
    };

    const handleEndedConsultations = () => {
        window.location.href = doctorLocations.endedConsultations;
    };

    const handleCreateSchedule = () => {
        window.location.href = doctorLocations.createDateSchedule;
    };

    const handleSchedule = () => {
        window.location.href = doctorLocations.schedule;
    };

    // Если профиль еще не загружен — показываем пустой блок или лоадер
    if (!profileLoaded) return null;

    return (
        <>
            <Button
                onClick={handleConsultations}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Мои консультации
            </Button>
            <Button
                onClick={handleEndedConsultations}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Проведенные консультации
            </Button>
            {hasPermission(store.selectedProfile, 'schedulerEdit') && (
                <Button
                    onClick={handleCreateSchedule}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Моё расписание
                </Button> 
            )}
            <Button
                onClick={handleSchedule}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Календарь
            </Button>
        </>
    );
}

export default DoctorButtons;
