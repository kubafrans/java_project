import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('jwt') || ''
  );

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
