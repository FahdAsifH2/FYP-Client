import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../_config/config";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load token from storage on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (token) {
                    // Verify token and load user profile from API in a real app
                    // Here we are just mocking a user load if token exists
                    // Note: In production you'd use your /me endpoint here
                    await fetchMe(token);
                }
            } catch (error) {
                console.error("Error loading auth token:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const fetchMe = async (token) => {
        try {
            // Assume API config exists to hit backend server running externally
            // Ensure you configure config.API_URL to point to your backend.
            const res = await axios.get(`${config.API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.user) {
                setUser(res.data.user);
            }
        } catch (err) {
            console.log("Token invalid or expired", err);
            await logout();
        }
    }

    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await axios.post(`${config.API_URL}/api/auth/login`, { email, password });

            if (res.data && res.data.token) {
                const { token, user } = res.data;
                await AsyncStorage.setItem("userToken", token);
                setUser(user);
                return { success: true };
            }
            return { success: false, error: "Invalid response from server" };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error?.response?.data?.error || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        try {
            setLoading(true);
            const res = await axios.post(`${config.API_URL}/api/auth/register`, { name, email, password, role });

            if (res.data && res.data.token) {
                const { token, user } = res.data;
                await AsyncStorage.setItem("userToken", token);
                setUser(user);
                return { success: true };
            }
            return { success: false, error: "Invalid response from server" };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: error?.response?.data?.error || "Registration failed" };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
