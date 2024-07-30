import React from 'react';
import Button from '@mui/material/Button';
import doctorLocations from '../../../../../Locations/DoctorLocations';

function DoctorButtons() {
    const handleConsultations = () => {
        window.location.href = doctorLocations.consultations;
    };

    const handleEndedConsultations = () => {
        window.location.href = doctorLocations.endedConsultations;
    };

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
        </>
    );
}

export default DoctorButtons;
