import axios from 'axios';

// Dùng cho api không cần Bearer token như đăng ký,...

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosAuth.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosAuth;
