import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on app load
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("clozety_token");
            if (token) {
                try {
                    // Verify token by fetching user profile
                    const res = await api.get("/users/profile");
                    setUser(res.data.data); // backend returns { success: true, data: { user } }
                } catch (error) {
                    console.error("Session expired or invalid token", error);
                    localStorage.removeItem("clozety_token");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();

        // Listen for the custom "auth-expired" event triggered by axios interceptor
        const handleAuthExpired = () => {
            setUser(null);
            toast.error("Session expired. Please log in again.");
        };
        window.addEventListener("auth-expired", handleAuthExpired);

        return () => window.removeEventListener("auth-expired", handleAuthExpired);
    }, []);

    // Login Function
    const login = async (email, password) => {
        try {
            const res = await api.post("/api/auth/login", { email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem("clozety_token", token);
            setUser(userData);
            toast.success("Welcome back!");
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    // Register Function
    const register = async (name, email, password) => {
        try {
            const res = await api.post("/api/auth/register", { name, email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem("clozety_token", token);
            setUser(userData);
            toast.success("Account created successfully!");
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem("clozety_token");
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
