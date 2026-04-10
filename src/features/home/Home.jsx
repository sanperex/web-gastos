import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link as RouterLink } from 'react-router-dom';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { useAuth } from '../auth/AuthContext';
import { expensesApi } from '../crud/expensesApi';

const publicFeatures = [
  {
    icon: <ScienceRoundedIcon sx={{ color: '#8ef6e4' }} />,
    title: 'Control total (o casi)',
    description:
      'Una landing para que ingreses tus gastos rapidamente y veas en que se te fue la quincena.',
  },
  {
    icon: <TravelExploreRoundedIcon sx={{ color: '#d9ff66' }} />,
    title: 'Buscador de personajes extra',
    description:
      'Dejamos la API de Rick and Morty para que busques personajes cuando te aburras de ver deudas.',
  },
  {
    icon: <AutoAwesomeRoundedIcon sx={{ color: '#ffb86b' }} />,
    title: 'Hecho por un junior',
    description:
      'Codigo super facil de leer porque lo escribimos usando variables gigantes e if-else por todos lados.',
  },
];

const privateFeatures = [
  {
    icon: <InsightsRoundedIcon sx={{ color: '#8ef6e4' }} />,
    title: 'Tu panel te espera',
    description:
      'Ve tus movimientos, ajusta registros y revisa como se reparte tu gasto sin volver a iniciar sesion.',
  },
  {
    icon: <SavingsRoundedIcon sx={{ color: '#d9ff66' }} />,
    title: 'Persistencia por usuario',
    description:
      'Tus registros quedan asociados a tu cuenta en Mongo Atlas y no desaparecen al recargar la pagina.',
  },
  {
    icon: <TableChartRoundedIcon sx={{ color: '#ffb86b' }} />,
    title: 'Resumen rapido',
    description:
      'Desde la portada puedes saltar directo a tu dashboard o revisar el explorador de API.',
  },
];

export function Home() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, count: 0, categories: 0 });
  const isLoggedIn = Boolean(currentUser);
  const features = isLoggedIn ? privateFeatures : publicFeatures;

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.id) {
        setStats({ total: 0, count: 0, categories: 0 });
        return;
      }

      try {
        const response = await expensesApi.get(`/user/${currentUser.id}`);
        const expenses = response.data.expenses || [];
        const total = expenses.reduce((acc, expense) => acc + Number(expense.monto || 0), 0);
        const categories = new Set(expenses.map((expense) => expense.categoria).filter(Boolean)).size;
        setStats({
          total,
          count: expenses.length,
          categories,
        });
      } catch (error) {
        setStats({ total: 0, count: 0, categories: 0 });
      }
    };

    loadStats();
  }, [currentUser?.id]);

  return (
    <Box sx={{ flexGrow: 1, py: { xs: 3, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3}>
              <Chip
                icon={<MonetizationOnRoundedIcon />}
                label={isLoggedIn ? `Sesion activa: ${currentUser.name}` : 'Billetera Feliz'}
                sx={{
                  alignSelf: 'flex-start',
                  px: 1,
                  color: '#031017',
                  bgcolor: '#8ef6e4',
                  fontWeight: 700,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  maxWidth: 760,
                  fontSize: { xs: '2.9rem', md: '5.2rem' },
                  lineHeight: { xs: 1.04, md: 0.95 },
                  letterSpacing: '-0.05em',
                }}
              >
                {isLoggedIn
                  ? `Bienvenido ${currentUser.name.split(' ')[0]}, tus gastos ya estan listos para seguir.`
                  : 'Controla tus gastos sin sentir que repruebas mates.'}
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ maxWidth: 720, lineHeight: 1.55 }}
              >
                {isLoggedIn
                  ? 'Tu landing ahora muestra accesos directos y un resumen de tu cuenta para seguir justo donde te quedaste.'
                  : 'Anade tus cobros, calcula tus deudas y revisa en que se va todo tu dinero con esta app simple y rapida. De paso tambien puedes buscar personajes de television.'}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} to="/crud" variant="contained" size="large">
                  {isLoggedIn ? 'Ir a mi dashboard' : 'Mis Gastos'}
                </Button>
                <Button component={RouterLink} to="/api" variant="outlined" size="large">
                  Buscador API
                </Button>
                {!isLoggedIn && (
                  <Button component={RouterLink} to="/register" variant="outlined" size="large">
                    Crear cuenta
                  </Button>
                )}
                <Button
                  component="a"
                  href="https://github.com/sanperex"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHubIcon />}
                  variant="text"
                  size="large"
                  sx={{ color: '#fff' }}
                >
                  Repositorio
                </Button>
              </Stack>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {isLoggedIn ? (
                  <>
                    <Chip label={`${stats.count} registros`} sx={{ bgcolor: 'rgba(142,246,228,0.12)' }} />
                    <Chip label={`$${stats.total.toLocaleString()} acumulados`} sx={{ bgcolor: 'rgba(217,255,102,0.12)' }} />
                    <Chip label={`${stats.categories} categorias`} sx={{ bgcolor: 'rgba(255,184,107,0.12)' }} />
                  </>
                ) : (
                  <>
                    <Chip label="Ahorros reales" sx={{ bgcolor: 'rgba(142,246,228,0.12)' }} />
                    <Chip label="Sin numeros rojos" sx={{ bgcolor: 'rgba(217,255,102,0.12)' }} />
                    <Chip label="Diseno fancy" sx={{ bgcolor: 'rgba(255,184,107,0.12)' }} />
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                position: 'relative',
                minHeight: 560,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                overflow: 'hidden',
                p: { xs: 3, md: 4 },
                border: '1px solid rgba(142,246,228,0.18)',
                background:
                  'radial-gradient(circle at 50% 38%, rgba(164,255,102,0.22) 0%, rgba(99,214,195,0.18) 20%, rgba(10,18,35,0.95) 44%, rgba(7,12,24,0.98) 100%)',
                boxShadow: '0 35px 110px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at center, rgba(197,255,92,0.42) 0, rgba(141,255,109,0.26) 10%, rgba(108,255,187,0.18) 17%, rgba(31,80,91,0.1) 28%, transparent 41%)',
                  transform: 'scale(1.15)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: '18% 18%',
                  borderRadius: '50%',
                  border: '2px solid rgba(180,255,110,0.28)',
                  boxShadow:
                    '0 0 0 12px rgba(142,246,228,0.07), 0 0 0 28px rgba(142,246,228,0.04), 0 0 50px rgba(166,255,86,0.28)',
                }}
              />

              <Stack spacing={2} sx={{ position: 'relative', zIndex: 2, mb: 4 }}>
                <Card sx={{ borderRadius: 3, bgcolor: 'rgba(8, 16, 29, 0.76)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Typography variant="overline" sx={{ color: '#8ef6e4' }}>
                      {isLoggedIn ? 'Resumen Personal' : 'Dinero Control'}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {isLoggedIn ? 'Tu cuenta sigue activa' : 'Tus finanzas centralizadas'}
                    </Typography>
                    <Typography color="text.secondary">
                      {isLoggedIn
                        ? `Tienes ${stats.count} movimientos guardados y un total de $${stats.total.toLocaleString()} asociados a ${currentUser.email}.`
                        : 'Un pequeno admin panel para que no te gastes todo en tonterias y lleves la cuenta clara.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              <Stack spacing={2} sx={{ position: 'relative', zIndex: 2 }}>
                {features.map((feature) => (
                  <Card
                    key={feature.title}
                    sx={{
                      borderRadius: 3,
                      bgcolor: 'rgba(8, 16, 29, 0.82)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        {feature.icon}
                        <Typography variant="h6">{feature.title}</Typography>
                      </Stack>
                      <Typography color="text.secondary">{feature.description}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
