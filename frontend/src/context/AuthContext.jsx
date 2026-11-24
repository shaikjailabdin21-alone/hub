import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists on mount
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(storedUser);
      }

      // Verify token with backend
      authService
        .getMe()
        .then((res) => {
          if (res && res.user) {
            setUser(res.user);
            localStorage.setItem('hub_user_profile', JSON.stringify(res.user));
          }
        })
        .catch((err) => {
          console.warn('[AuthContext] Token verification failed:', err.message);

          // Determine if this is a real auth rejection vs network/server error
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            // Token is invalid/expired — force logout
            authService.logout();
            setUser(null);
            setToken(null);
          }
          // For network errors (backend down) or 5xx — keep the stored user/token
          // so the UI doesn't flicker to login when the backend is temporarily unreachable
          // but the token might still be valid.
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check all fields.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
