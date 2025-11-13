import { createContext, useEffect, useState, useRef } from 'react';
import { loginService, clearAuthData, saveAuthData, registerService } from '../services/AuthService';
import { isTokenExpired, getRemainingTime } from '../utils/TokenUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const setAutoLogout = (token) => {
    const timeLeft = getRemainingTime(token);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => logout(), timeLeft);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setAutoLogout(savedToken);
    } else {
      logout();
    }

    setLoading(false);
  }, []);

  
  const register = async (data) => {
    try {
      const res = await registerService(data);
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (credentials) => {
    try {
      const { token, user } = await loginService(credentials);
      console.log("🧩 LoginService returned:", { token, user }); // add this line
      saveAuthData(token, user);
      setToken(token);
      setUser(user);
      setAutoLogout(token);
      return { success: true, user };
    } catch (error) {
      console.error("❌ Login error:", error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
