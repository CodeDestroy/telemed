import React from 'react';
import { Typography, MenuItem } from '@mui/material';
import doctorLocations from '../../../../../Locations/DoctorLocations';

function DoctorItems() {
    const handleConsultations = () => {
        window.location.href = doctorLocations.consultations;
    };

    const handleEndedConsultations = () => {
        window.location.href = doctorLocations.endedConsultations;
    };

    return (
        <>
            <MenuItem onClick={handleConsultations}>
                <Typography textAlign="center">Актульные консультации</Typography>
            </MenuItem>
            <MenuItem onClick={handleEndedConsultations}>
                <Typography textAlign="center">Проведенные консультации</Typography>
            </MenuItem>
        </>
    );
}

export default DoctorItems;

