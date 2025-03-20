import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration or auth errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            // Redirect to login (you'll need to implement this part)
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 