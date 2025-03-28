import React from 'react';
import { Typography, MenuItem } from '@mui/material';
import adminLocations from '../../../../../Locations/AdminLocations';

function OperatorItems() {
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
            {/* <MenuItem onClick={handleAdminDashboard}>
                <Typography textAlign="center">Панель администратора</Typography>
            </MenuItem> */}
            {/* <MenuItem onClick={handleDoctorManagement}>
                <Typography textAlign="center">Управление врачами</Typography>
            </MenuItem> */}
            <MenuItem onClick={handlePatientManagement}>
                <Typography textAlign="center">Управление пациентами</Typography>
            </MenuItem>
            {/* <MenuItem onClick={handleScheduleManagement}>
                <Typography textAlign="center">Управление расписанием</Typography>
            </MenuItem> */}
            {/* <MenuItem onClick={handleSlotsManagement}>
                <Typography textAlign="center">Управление слотами</Typography>
            </MenuItem> */}

            <MenuItem onClick={handleCalendarManagement}>
                <Typography textAlign="center">Управление слотами</Typography>
            </MenuItem>
        </>
    );
}

export default OperatorItems;
