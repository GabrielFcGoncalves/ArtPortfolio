'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, initialize the Keycloak JS adapter here.
    // For scaffolding the boilerplate flow, we mock an existing token.
    const storedToken = localStorage.getItem('keycloak_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      // automatically "login" for prototyping purposes
      const mockToken = 'mock_jwt_token_123';
      localStorage.setItem('keycloak_token', mockToken);
      setToken(mockToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    // Redirect to Keycloak login
    console.log('Redirect to Keycloak login...');
  };

  const logout = () => {
    localStorage.removeItem('keycloak_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
