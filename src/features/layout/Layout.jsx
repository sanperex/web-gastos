import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../auth/AuthContext';

// Las rutas globales
const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Buscador API', to: '/api' },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="app-shell" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          bgcolor: 'rgba(5, 10, 18, 0.72)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 78 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 1,
                  bgcolor: 'rgba(142,246,228,0.14)',
                  color: '#8ef6e4',
                }}
              >
                <CalculateRoundedIcon />
              </Box>

              {/* El logo que te lleva a inicio */}
              <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Mis Gastos App
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  controla tu dinero facilito
                </Typography>
              </Box>
            </Stack>

            {/* Los botones de navegacion */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, alignItems: 'center' }}>
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    color="inherit"
                    sx={{
                      px: 2,
                      color: active ? '#8ef6e4' : 'text.secondary',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              {/* Mostrar botones según estado de autenticación */}
              {currentUser ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/crud"
                    color="inherit"
                    sx={{
                      px: 2,
                      color: location.pathname === '/crud' ? '#8ef6e4' : 'text.secondary',
                    }}
                  >
                    Dashboard
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#8ef6e4', color: '#000', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ ml: 1, mr: 2, fontWeight: 600 }}>
                      {currentUser.name.split(' ')[0]}
                    </Typography>
                    <IconButton onClick={handleLogout} color="error" title="Cerrar sesión" size="small">
                      <LogoutRoundedIcon fontSize="small"/>
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ px: 2, color: location.pathname === '/login' ? '#8ef6e4' : 'text.secondary' }}
                  >
                    Login
                  </Button>
                  <Button component={RouterLink} to="/register" variant="contained" size="small" sx={{ ml: 1 }}>
                    Crear Cuenta
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Aqui va el contenido de la pagina */}
      <Box component="main" sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
