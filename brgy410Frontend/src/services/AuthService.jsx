import AxiosInstance from '../utils/AxiosInstance';

export const loginService = async (credentials) => {
  const res = await AxiosInstance.post('/auth/login', credentials, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data; // { token, user }
};

export const registerService = async (data) => {
  const res = await AxiosInstance.post('/auth/signup', data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data;
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
