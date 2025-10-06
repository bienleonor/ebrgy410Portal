import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if needed
  withCredentials: true, // optional: allows sending cookies if using them
});

// 🔐 Automatically inject JWT token into every request
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use sessionStorage if preferred
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
