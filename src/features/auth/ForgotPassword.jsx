import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';

export function ForgotPassword() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 7,
          background:
            'linear-gradient(180deg, rgba(10,15,29,0.96) 0%, rgba(30,29,52,0.92) 100%)',
        }}
      >
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Box sx={{ p: 1.4, borderRadius: '50%', bgcolor: 'rgba(255,201,87,0.14)' }}>
            <LockResetIcon sx={{ color: 'warning.main' }} />
          </Box>
          <Typography component="h1" variant="h3">
            Recuperar contraseña
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
            Ingresa tu correo y te enviaremos instrucciones para restablecer el acceso de forma segura.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button type="submit" fullWidth variant="contained" color="warning" sx={{ mt: 3, mb: 2 }}>
            Enviar instrucciones
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              Volver al inicio de sesión
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
