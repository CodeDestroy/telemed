import React, { useContext, useEffect, useState } from 'react';
import { Typography, MenuItem } from '@mui/material';
import doctorLocations from '../../../../../Locations/DoctorLocations';
import { Context } from '../../../../..';
import { hasPermission } from '../../../../Utils/permissions';

function DoctorItems() {
    const { store } = useContext(Context);
    const [profileLoaded, setProfileLoaded] = useState(false);

    useEffect(() => {
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
        window.location.href = doctorLocations.createSchedule;
    };

    const handleSchedule = () => {
        window.location.href = doctorLocations.schedule;
    };

    if (!profileLoaded) return null; // не рендерим, пока профиль не загрузился

    return (
        <>
            <MenuItem onClick={handleConsultations}>
                <Typography textAlign="center">Актуальные консультации</Typography>
            </MenuItem>
            <MenuItem onClick={handleEndedConsultations}>
                <Typography textAlign="center">Проведенные консультации</Typography>
            </MenuItem>
            {hasPermission(store.selectedProfile, 'schedulerEdit') && (
                <MenuItem onClick={handleCreateSchedule}>
                    <Typography textAlign="center">Моё расписание</Typography>
                </MenuItem>
            )}
            <MenuItem onClick={handleSchedule}>
                <Typography textAlign="center">Календарь</Typography>
            </MenuItem>
        </>
    );
}

export default DoctorItems;
