import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
  TextField,
  Button
} from '@mui/material';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SearchIcon from '@mui/icons-material/Search';
import { apiClient } from '../apiClient';

const statusTone = {
  Alive: 'success',
  Dead: 'error',
  unknown: 'default',
};

export function ApiRyC() {
  // estos son los estados
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Esto lo agrego para el buscador de personajes
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [busquedaActual, setBusquedaActual] = useState(''); // guarda lo que el usuario quiere buscar

  // funcion que se ejecuta al cargar y cada vez que cambia page o busquedaActual
  useEffect(() => {
    let ignorar = false;

    // funcion para traer los personajes
    const traerPersonajes = async () => {
      setLoading(true);
      setError('');

      try {
        // aqui pedimos con axios agregando los parametros de la pagina y el nombre opcional
        const params = { page: page };
        if (busquedaActual) {
          params.name = busquedaActual;
        }

        const respuesta = await apiClient.get('/character', { params });

        if (ignorar) return;

        setCharacters(respuesta.data.results);
        setInfo(respuesta.data.info);
      } catch (errorDelRequest) {
        if (ignorar) return;

        if (!errorDelRequest.response) {
          // Si no hay response es un error de red o timeout
          setError('Error de conexión o la petición tardó demasiado. Verifica tu internet e intenta de nuevo.');
        } else {
          // Si respondió, normalmente un 404 es que no hay personajes reales
          setError(
            errorDelRequest.response?.data?.error ||
              'No se pudo encontrar personajes con ese nombre. Intente con otro.'
          );
        }
        
        // Si hay error mejor vaciamos los personajes para que no se vean los viejos
        setCharacters([]);
        setInfo(null);
      } finally {
        if (!ignorar) {
          setLoading(false);
        }
      }
    };

    traerPersonajes();

    return () => {
      ignorar = true;
    };
  }, [page, busquedaActual]);

  // funcion para el boton de buscar
  const darleClickABuscar = () => {
    setBusquedaActual(textoBusqueda.trim());
    setPage(1); // lo regreso a la pagina 1 por si busca algo nuevo
  };

  // Esta funcion es para cambiar la pagina
  const cambiarDePagina = (evento, paginaDestino) => {
    setPage(paginaDestino);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack spacing={4}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid rgba(142,246,228,0.14)',
            background:
              'linear-gradient(145deg, rgba(10,18,34,0.98) 0%, rgba(10,33,43,0.94) 55%, rgba(18,56,47,0.88) 100%)',
          }}
        >
          <Stack spacing={2}>
            <Chip
              icon={<PublicRoundedIcon />}
              label="Rick and Morty API"
              sx={{
                alignSelf: 'flex-start',
                color: '#031017',
                bgcolor: '#8ef6e4',
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                maxWidth: 900,
                fontSize: { xs: '2rem', md: '3.6rem' },
                lineHeight: 1.02,
              }}
            >
              Buscador de personajes hecho con Axios
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760 }}>
              Busca por nombre y mira los resultados paginados.
            </Typography>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Chip icon={<HubRoundedIcon />} label={`${info?.count ?? 0} personajes totales`} />
              <Chip icon={<AutoAwesomeRoundedIcon />} label={`${info?.pages ?? 0} páginas`} />
            </Stack>

            {/* Aqui va el buscador*/}
            <Stack direction="row" spacing={2} sx={{ mt: 3, maxWidth: 600 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe un personaje, x ej: Rick"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}
              />
              <Button 
                variant="contained" 
                startIcon={<SearchIcon />}
                onClick={darleClickABuscar}
                sx={{ px: 4, bgcolor: '#8ef6e4', color: '#000', fontWeight: 'bold' }}
              >
                Buscar
              </Button>
            </Stack>
          </Stack>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {/* Paginas de abajo */}
        {info?.pages > 0 && (
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.08)',
              bgcolor: 'rgba(8, 12, 24, 0.78)',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="h5">Viendo página {page} de {info?.pages ?? 1}</Typography>
              <Pagination
                count={info?.pages ?? 1}
                page={page}
                onChange={cambiarDePagina}
                color="primary"
                shape="rounded"
                size="large"
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'text.primary',
                    borderColor: 'rgba(255,255,255,0.12)',
                    bgcolor: 'rgba(255,255,255,0.03)',
                  },
                  '& .Mui-selected': {
                    bgcolor: 'primary.main !important',
                    color: 'primary.contrastText',
                    fontWeight: 800,
                  },
                }}
              />
            </Stack>
          </Box>
        )}

        {/* Muestra un spinner mientras carga */}
        {loading ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: 280 }}>
            <CircularProgress size={52} />
            <Typography color="text.secondary">Cargando personajes con axios...</Typography>
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {/* Hago un map gigante para las tarjetas */}
            {characters.map((personaje) => (
              <Grid key={personaje.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#0d1425',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
                      minHeight: 240,
                    }}
                  >
                    <Box
                      component="img"
                      src={personaje.image}
                      alt={personaje.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: 220,
                        objectFit: 'cover',
                      }}
                    />

                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar
                          src={personaje.image}
                          alt={personaje.name}
                          sx={{ width: 48, height: 48, display: { xs: 'none', sm: 'flex' } }}
                        />
                        <Box>
                          <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
                            {personaje.name}
                          </Typography>
                          <Typography color="text.secondary">
                            {personaje.species} • {personaje.gender}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                        <Chip
                          label={personaje.status}
                          color={statusTone[personaje.status] ?? 'default'}
                          size="small"
                        />
                        <Chip label={personaje.origin.name} variant="outlined" size="small" />
                      </Stack>

                      <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                      <Stack spacing={1.2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ubicación
                          </Typography>
                          <Typography variant="body1">{personaje.location.name}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
