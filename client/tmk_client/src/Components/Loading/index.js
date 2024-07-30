import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0'
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Загрузка...
            </Typography>
        </Box>
    );
};

export default LoadingScreen;
