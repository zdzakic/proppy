import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = ({ access, refresh, user }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(user);

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
