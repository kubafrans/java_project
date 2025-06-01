import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('jwt') || ''
  );
  const [loading, setLoading] = useState(true);

  // Validate token on mount and when token changes
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await axios.post(
          'http://localhost/api/auth/validate',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoading(false);
      } catch {
        setToken('');
        localStorage.removeItem('jwt');
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
