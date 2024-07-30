import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Box>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Извините, но страница, которую вы ищете, не существует.
        </Typography>
        <Button
          variant="text"
          onClick={handleGoBack}
          sx={{
            color: 'primary.main',
            borderColor: 'primary.main',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            mt: 2,
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
            }
          }}
        >
          Назад
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
