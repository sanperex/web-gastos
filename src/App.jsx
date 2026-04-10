import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ApiRyC } from './features/api/components/ApiRyC';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { GestorGastos } from './features/crud/GestorGastos';
import { Home } from './features/home/Home';
import { Layout } from './features/layout/Layout';

function App() {
  return (
    <Box className="app-shell">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="api" element={<ApiRyC />} />
          <Route path="crud" element={<GestorGastos />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
