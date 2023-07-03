import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import FormatPage from './FormatPage';
import LyricsInput from './LyricsInput';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';


let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1024, // our custom breakpoint
      xl: 1920,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#513466',
    },
    secondary: {
      main: '#0f0f12',
    },
    text: {
      secondary: '#ffffff',
    },
  },
  props: {
    MuiAppBar: {
      color: 'secondary',
    },
  },
});

function App() {
 
  return (
    <div>
      <ThemeProvider theme={theme}>
    <div>
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<FormatPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </ThemeProvider>
  </div>
  );
}

export default App