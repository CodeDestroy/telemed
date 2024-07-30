import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  ruRU,
);
export const LocalizationContext = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);
