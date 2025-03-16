import React from 'react';
import Button from '@mui/material/Button';
import adminLocations from '../../../../../Locations/AdminLocations';

function AdminButtons() {
    const handleAdminDashboard = () => {
        window.location.href = adminLocations.dashboard;
    };

    const handleDoctorManagement = () => {
        window.location.href = adminLocations.doctorManagement;
    };

    const handlePatientManagement = () => {
        window.location.href = adminLocations.patientManagement;
    };

    const handleSlotsManagement = () => {
        window.location.href = adminLocations.slotsManagement;
    }

    const handleCalendarManagement = () => {
        window.location.href = adminLocations.calendar
    }

    const handleScheduleManagement = () => {
        window.location.href = adminLocations.scheduleByDates
    }
    return (
        <>
            {/* <Button
                onClick={handleAdminDashboard}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Панель администратора
            </Button> */}
            <Button
                onClick={handleDoctorManagement}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Управление врачами
            </Button>
            <Button
                onClick={handlePatientManagement}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Управление пациентами
            </Button>
            <Button
                onClick={handleScheduleManagement}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Управление расписанием
            </Button>
            {/* <Button
                onClick={handleSlotsManagement}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Управление слотами
            </Button> */}
            <Button
                onClick={handleCalendarManagement}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Управление слотами
            </Button>
        </>
    );
}

export default AdminButtons;
