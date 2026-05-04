import { createContext, useContext, useState, useEffect } from 'react';
import api, { userApi } from '../utils/api';

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => JSON.parse(localStorage.getItem('bl_user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bl_user_token');
    if (token) {
      userApi.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('bl_user_token'); localStorage.removeItem('bl_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password, phone) => {
    const res = await api.post('/users/register', { name, email, password, phone });
    localStorage.setItem('bl_user_token', res.data.token);
    localStorage.setItem('bl_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    localStorage.setItem('bl_user_token', res.data.token);
    localStorage.setItem('bl_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('bl_user_token');
    localStorage.removeItem('bl_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('bl_user_token');
    if (!token) return;
    const res = await userApi.get('/users/me');
    setUser(res.data);
    localStorage.setItem('bl_user', JSON.stringify(res.data));
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
