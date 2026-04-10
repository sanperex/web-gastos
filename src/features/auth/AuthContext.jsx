import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './authApi';

const AuthContext = createContext();
const CURRENT_USER_STORAGE_KEY = 'currentUser';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          ...parsedUser,
          email: normalizeEmail(parsedUser.email),
        });
      } catch (error) {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const response = await authApi.post('/login', {
        email: normalizedEmail,
        password,
      });

      const userToStore = {
        ...response.data.user,
        email: normalizeEmail(response.data.user.email),
      };

      setCurrentUser(userToStore);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToStore));

      return { success: true };
    } catch (error) {
      const message = !error.response
        ? 'No hay conexion con el backend. Ejecuta npm run dev:backend e intenta de nuevo.'
        : error.response?.data?.message || 'No se pudo iniciar sesion';

      return {
        success: false,
        message,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const response = await authApi.post('/register', {
        name: String(name || '').trim(),
        email: normalizedEmail,
        password,
      });

      const userToStore = {
        ...response.data.user,
        email: normalizeEmail(response.data.user.email),
      };

      setCurrentUser(userToStore);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToStore));

      return { success: true };
    } catch (error) {
      const message = !error.response
        ? 'No hay conexion con el backend. Ejecuta npm run dev:backend e intenta de nuevo.'
        : error.response?.data?.message || 'No se pudo registrar el usuario';

      return {
        success: false,
        message,
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
