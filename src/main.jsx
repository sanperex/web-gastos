import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App.jsx';

import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5cf9db',
      contrastText: '#04111b',
    },
    secondary: {
      main: '#ff8a5b',
    },
    background: {
      default: '#050816',
      paper: '#0e152b',
    },
    text: {
      primary: '#f5f7ff',
      secondary: 'rgba(222, 229, 255, 0.72)',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Exo 2", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontFamily: '"Orbitron", "Exo 2", sans-serif',
    },
    h2: {
      fontWeight: 800,
      fontFamily: '"Orbitron", "Exo 2", sans-serif',
    },
    h3: {
      fontWeight: 700,
      fontFamily: '"Orbitron", "Exo 2", sans-serif',
    },
    h4: {
      fontWeight: 700,
      fontFamily: '"Orbitron", "Exo 2", sans-serif',
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(92,249,219,0.08), transparent 25%), radial-gradient(circle at 85% 15%, rgba(255,138,91,0.08), transparent 22%), radial-gradient(circle at 70% 80%, rgba(167,255,88,0.06), transparent 20%), linear-gradient(180deg, #050816 0%, #091224 50%, #050816 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 18px 60px rgba(0, 0, 0, 0.18)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 22,
          paddingBlock: 12,
          boxShadow: '0 0 0 1px rgba(142,246,228,0.12), 0 12px 24px rgba(0,0,0,0.18)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.02)',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            boxShadow: '0 0 0 3px rgba(142,246,228,0.12)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.08)',
        },
        head: {
          fontWeight: 700,
          color: '#8ef6e4',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

import { AuthProvider } from './features/auth/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
