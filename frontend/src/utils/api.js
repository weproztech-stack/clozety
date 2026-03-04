import axios from "axios";

// Create an Axios instance with base configuration
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Send cookies if needed
});

// Request Interceptor: Attach JWT token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("clozety_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors (e.g., token expiration)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the token is invalid or expired (401 Unauthorized), we can auto-logout here
        if (error.response && error.response.status === 401) {
            // Avoid clearing if they are already trying to login
            if (!error.config.url.includes("/auth/login")) {
                localStorage.removeItem("clozety_token");
                // Dispatching a custom event that AuthContext can listen to for UI updates
                window.dispatchEvent(new Event("auth-expired"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
