import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => {
    if (!passwordValue) return null;
    let numHits = 0;
    if (passwordValue.length >= 8) numHits++;
    if (/[A-Z]/.test(passwordValue)) numHits++;
    if (/[0-9]/.test(passwordValue)) numHits++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) numHits++;

    if (passwordValue.length < 8) return { label: 'Insegura (Minimo 8 caracteres)', value: 25, color: 'error' };
    if (numHits === 1) return { label: 'Debil', value: 33, color: 'warning' };
    if (numHits === 2 || numHits === 3) return { label: 'Media', value: 66, color: 'info' };
    return { label: 'Fuerte', value: 100, color: 'success' };
  }, [passwordValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');

    if (!email.includes('@')) {
      setError('Por favor incluye un signo "@" en la direccion de correo electronico.');
      return;
    }

    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    const result = await register(name, email, password);
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
            'linear-gradient(180deg, rgba(11,16,31,0.96) 0%, rgba(24,20,43,0.94) 100%)',
        }}
      >
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Box sx={{ p: 1.4, borderRadius: '50%', bgcolor: 'rgba(255,138,91,0.14)' }}>
            <PersonAddIcon sx={{ color: 'secondary.main' }} />
          </Box>
          <Typography component="h1" variant="h3">
            Crear cuenta
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
            Registrate para gestionar tu flujo de datos con una interfaz moderna y lista para crecer.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre completo"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            type="email"
            label="Correo electronico"
            name="email"
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contrasena (min. 8 caracteres)"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={passwordValue}
            onChange={(event) => setPasswordValue(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
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

          {strength && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Seguridad de contrasena:
                </Typography>
                <Typography variant="caption" color={`${strength.color}.main`} sx={{ fontWeight: 'bold' }}>
                  {strength.label}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={strength.value}
                color={strength.color}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }}>
            Registrarse
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              Ya tienes una cuenta? Inicia sesion
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
