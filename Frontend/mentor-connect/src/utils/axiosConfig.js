import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Enable CORS preflight requests
        if (config.method === 'options') {
            config.headers['Access-Control-Request-Method'] = 'GET, POST, PUT, DELETE';
            config.headers['Access-Control-Request-Headers'] = 'Content-Type, Authorization';
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration or auth errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);

        // Network errors
        if (!error.response) {
            console.error('Network Error - No response received from server');
            return Promise.reject(new Error('Network Error - Unable to connect to the server. Please check your internet connection.'));
        }

        // Authentication errors
        if (error.response.status === 401) {
            console.error('Authentication Error - Unauthorized');
            localStorage.removeItem('authToken');
            window.location.href = '/login'; // Redirect to login
        }

        // CORS errors
        if (error.response.status === 403) {
            console.error('CORS or Permission Error - Forbidden');
            // Check if authentication is required
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = '/login'; // Redirect to login if no token
            }
        }

        return Promise.reject(error);
    }
);

export default api; 