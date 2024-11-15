import React, {useContext} from 'react';
import Button from '@mui/material/Button';
import doctorLocations from '../../../../../Locations/DoctorLocations';
import { Context } from '../../../../..';
function DoctorButtons() {
    const { store } = useContext(Context)
    const handleConsultations = () => {
        window.location.href = doctorLocations.consultations;
    };

    const handleEndedConsultations = () => {
        window.location.href = doctorLocations.endedConsultations;
    };

    const handleCreateSchedule = () => {
        if (store.user.schedulerType == 'weekDay')
            window.location.href = doctorLocations.createSchedule
        else {
            window.location.href = doctorLocations.createDateSchedule
        }
    }

    const handleSchedule = () => {
        
        window.location.href = doctorLocations.schedule
    }

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
            <Button
                onClick={handleCreateSchedule}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Моё расписание
            </Button>
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
