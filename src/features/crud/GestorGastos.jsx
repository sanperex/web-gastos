import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { expensesApi } from './expensesApi';

const CATEGORIAS_PERMITIDAS = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Hogar',
  'Tecnologia',
  'Otros',
];

const METODOS_PAGO = ['Efectivo', 'Tarjeta'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3', '#19FF19'];

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#2065D1',
    },
    text: {
      primary: '#212B36',
      secondary: '#637381',
    },
  },
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle2: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
});

const normalizeExpense = (expense) => ({
  ...expense,
  id: expense._id,
  monto: Number(expense.monto),
});

export function GestorGastos() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [fecha, setFecha] = useState('');
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadExpenses = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await expensesApi.get(`/user/${currentUser.id}`);
        setGastos(response.data.expenses.map(normalizeExpense));
      } catch (requestError) {
        setError(
          !requestError.response
            ? 'No hay conexion con el backend. Ejecuta npm run dev:backend e intenta de nuevo.'
            : requestError.response?.data?.message || 'No se pudieron cargar los gastos'
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [currentUser?.id]);

  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setMetodoPago('Efectivo');
    setFecha('');
    setIdEdicion(null);
  };

  const guardarGasto = async () => {
    if (!descripcion || !monto || !categoria || !fecha || !metodoPago) {
      setError('Por favor llena todos los campos');
      return;
    }

    if (!currentUser?.id) {
      setError('No hay una sesion valida');
      return;
    }

    const payload = {
      descripcion,
      monto: Number(monto),
      categoria,
      fecha,
      metodoPago,
    };

    try {
      setError('');

      if (idEdicion) {
        const response = await expensesApi.put(`/user/${currentUser.id}/${idEdicion}`, payload);
        const expense = normalizeExpense(response.data.expense);
        setGastos((prev) => prev.map((gasto) => (gasto.id === idEdicion ? expense : gasto)));
      } else {
        const response = await expensesApi.post(`/user/${currentUser.id}`, payload);
        const expense = normalizeExpense(response.data.expense);
        setGastos((prev) => [...prev, expense]);
      }

      limpiarFormulario();
    } catch (requestError) {
      setError(
        !requestError.response
          ? 'No hay conexion con el backend. Ejecuta npm run dev:backend e intenta de nuevo.'
          : requestError.response?.data?.message || 'No se pudo guardar el gasto'
      );
    }
  };

  const activarEdicion = (gasto) => {
    setIdEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(gasto.monto);
    setCategoria(gasto.categoria);
    setMetodoPago(gasto.metodoPago || 'Efectivo');
    setFecha(gasto.fecha);
  };

  const borrarGasto = async (id) => {
    if (!currentUser?.id) {
      setError('No hay una sesion valida');
      return;
    }

    try {
      setError('');
      await expensesApi.delete(`/user/${currentUser.id}/${id}`);
      setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
      if (idEdicion === id) limpiarFormulario();
    } catch (requestError) {
      setError(
        !requestError.response
          ? 'No hay conexion con el backend. Ejecuta npm run dev:backend e intenta de nuevo.'
          : requestError.response?.data?.message || 'No se pudo eliminar el gasto'
      );
    }
  };

  const gastoTotal = useMemo(() => gastos.reduce((acc, gasto) => acc + gasto.monto, 0), [gastos]);
  const gastoPromedio = useMemo(() => (gastos.length > 0 ? gastoTotal / gastos.length : 0), [gastos, gastoTotal]);
  const gastoAlto = useMemo(() => (gastos.length > 0 ? Math.max(...gastos.map((gasto) => gasto.monto)) : 0), [gastos]);

  const ultimoGasto = useMemo(() => {
    if (gastos.length === 0) return 0;
    const gastosOrdenados = [...gastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return gastosOrdenados[0].monto;
  }, [gastos]);

  const gastosPorCategoria = useMemo(() => {
    const data = {};
    gastos.forEach((gasto) => {
      data[gasto.categoria] = (data[gasto.categoria] || 0) + gasto.monto;
    });
    return Object.keys(data).map((name) => ({ name, value: data[name] }));
  }, [gastos]);

  const gastosPorFecha = useMemo(() => {
    const data = {};
    gastos.forEach((gasto) => {
      data[gasto.fecha] = (data[gasto.fecha] || 0) + gasto.monto;
    });
    return Object.keys(data).sort().map((fechaItem) => ({ fecha: fechaItem, monto: data[fechaItem] }));
  }, [gastos]);

  if (!currentUser) return null;

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, width: '100%' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
            Hola {currentUser?.name}, Bienvenido de vuelta
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ p: 3, boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {idEdicion ? 'Actualizar Gasto' : 'Crear Registro'}
                </Typography>
                <Stack spacing={3}>
                  <TextField label="Descripcion" value={descripcion} onChange={(event) => setDescripcion(event.target.value)} fullWidth />
                  <TextField label="Monto" type="number" value={monto} onChange={(event) => setMonto(event.target.value)} fullWidth />
                  <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select value={categoria} label="Categoria" onChange={(event) => setCategoria(event.target.value)}>
                      {CATEGORIAS_PERMITIDAS.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Metodo de Pago</InputLabel>
                    <Select value={metodoPago} label="Metodo de Pago" onChange={(event) => setMetodoPago(event.target.value)}>
                      {METODOS_PAGO.map((metodo) => (
                        <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField label="Fecha" type="date" InputLabelProps={{ shrink: true }} value={fecha} onChange={(event) => setFecha(event.target.value)} fullWidth />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={guardarGasto} fullWidth size="large">
                      {idEdicion ? 'Guardar' : 'Anadir'}
                    </Button>
                    {idEdicion && <Button variant="outlined" color="error" onClick={limpiarFormulario}>Cancelar</Button>}
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Card elevation={0} sx={{ boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Descripcion</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Pago</TableCell>
                        <TableCell align="right">Monto</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading && gastos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            No hay datos para mostrar
                          </TableCell>
                        </TableRow>
                      )}
                      {gastos.map((gasto) => (
                        <TableRow key={gasto.id} hover>
                          <TableCell>{gasto.fecha}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{gasto.descripcion}</TableCell>
                          <TableCell>{gasto.categoria}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: gasto.metodoPago === 'Efectivo' ? 'rgba(34, 154, 22, 0.16)' : 'rgba(12, 83, 183, 0.16)',
                                color: gasto.metodoPago === 'Efectivo' ? '#229A16' : '#0C53B7',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {gasto.metodoPago || 'Efectivo'}
                            </Box>
                          </TableCell>
                          <TableCell align="right">${gasto.monto.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => activarEdicion(gasto)} color="primary"><EditRoundedIcon /></IconButton>
                            <IconButton onClick={() => borrarGasto(gasto.id)} color="error"><DeleteIcon /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ mb: 3 }}>
            Tus Metricas e Historial
          </Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#D1E9FC', color: '#061B64', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(12, 83, 183, 0) 0%, rgba(12, 83, 183, 0.24) 100%)' }}>
                      <AttachMoneyIcon fontSize="large" sx={{ color: '#0C53B7' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">${gastoTotal.toLocaleString()}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Gastos</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#D0F2FF', color: '#04297A', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(8, 102, 13, 0) 0%, rgba(8, 102, 13, 0.24) 100%)' }}>
                      <TrendingUpIcon fontSize="large" sx={{ color: '#08660D' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">${gastoPromedio.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Promedio</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#FFE7D9', color: '#7A0C2E', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(183, 33, 54, 0) 0%, rgba(183, 33, 54, 0.24) 100%)' }}>
                      <TrendingUpIcon fontSize="large" sx={{ color: '#B72136', transform: 'scaleY(-1)' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">${gastoAlto.toLocaleString()}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Gasto Maximo</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#E9FCD4', color: '#08660D', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(34, 154, 22, 0) 0%, rgba(34, 154, 22, 0.24) 100%)' }}>
                      <AttachMoneyIcon fontSize="large" sx={{ color: '#229A16' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">${ultimoGasto.toLocaleString()}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Ultimo Gasto</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#FFF7CD', color: '#7A4F01', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(183, 129, 3, 0) 0%, rgba(183, 129, 3, 0.24) 100%)' }}>
                      <ReceiptIcon fontSize="large" sx={{ color: '#B78103' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">{gastos.length}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Transacciones</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ bgcolor: '#F4F6F8', color: '#212B36', boxShadow: 'none', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(99, 115, 129, 0) 0%, rgba(99, 115, 129, 0.24) 100%)' }}>
                      <BarChartIcon fontSize="large" sx={{ color: '#637381' }} />
                    </Box>
                  </Box>
                  <Typography variant="h4">{gastosPorCategoria.length}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Categorias</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card elevation={0} sx={{ p: 3, boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Gastos en el Tiempo</Typography>
                <Box sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gastosPorFecha} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="fecha" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="monto" name="Gastos ($)" stroke="#2065D1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ p: 3, boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Distribucion Actual</Typography>
                <Box sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gastosPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {gastosPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `$${value}`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
