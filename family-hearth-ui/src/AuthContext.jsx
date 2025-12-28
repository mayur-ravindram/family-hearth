import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from './authedApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.log('AuthProvider rendered');
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // New state for authentication errors

  useEffect(() => {
    console.log('AuthContext useEffect triggered:', { accessToken, loading });
    const fetchUser = async () => {
      if (accessToken) {
        console.log('AuthContext: accessToken found, attempting to fetch user.');
        setLoading(true); // Indicate that we are loading user data
        setAuthError(null); // Clear any previous auth errors
        try {
          const response = await getCurrentUser();
          setUser(response.data);
          console.log('AuthContext: User fetched successfully:', response.data);
        } catch (error) {
          console.error("AuthContext: Failed to fetch user, token might be invalid.", error);
          if (error.response && error.response.status !== 401) {
            setAuthError('Your session has expired or is invalid. Please log in again.');
            logout(); // Clear invalid token
          }
          // The 401 error will be handled by the interceptor in authedApi.js
        } finally {
          setLoading(false); // Always set loading to false after attempt
          console.log('AuthContext: fetchUser completed, loading set to false.');
        }
      } else {
        setLoading(false); // No access token, so not loading anything
        console.log('AuthContext: No accessToken found, loading set to false.');
        setAuthError(null); // Clear error if no accessToken
      }
    };

    fetchUser();
  }, [accessToken]);

  const login = ({ accessToken, refreshToken }) => {
    console.log('AuthContext: login called, setting tokens.');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAccessToken(accessToken);
    setAuthError(null); // Clear any auth errors on successful login
  };

  const logout = () => {
    console.log('AuthContext: logout called, clearing tokens.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('familyId');
    setAccessToken(null);
    setUser(null);
    setAuthError(null); // Clear any auth errors on logout
  };

  const refreshUser = async () => {
    console.log('AuthContext: refreshUser called.');
    try {
      const response = await getCurrentUser();
      setUser(response.data);
      console.log('AuthContext: User refreshed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error("AuthContext: Failed to refresh user.", error);
      // Don't logout here, let interceptor handle 401
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    authError, // Expose authError
    refreshUser,
  };

  console.log('AuthContext: Providing value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth called, returning context:', context);
  return context;
};
