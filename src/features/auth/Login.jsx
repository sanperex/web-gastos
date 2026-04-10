import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    const result = await login(email, password);
    if (result.success) {
      navigate('/crud');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 7,
          background:
            'linear-gradient(180deg, rgba(8,14,28,0.96) 0%, rgba(15,25,48,0.92) 100%)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Box sx={{ p: 1.4, borderRadius: '50%', bgcolor: 'rgba(92,249,219,0.14)' }}>
            <SecurityIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography component="h1" variant="h3">
            Iniciar sesión
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            Accede a tu panel para explorar integraciones, autenticación y consumo de datos.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electronico"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Ingresar
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
              ¿Olvidaste tu contraseña?
            </MuiLink>
            <MuiLink component={RouterLink} to="/register" variant="body2">
              Crear cuenta
            </MuiLink>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
