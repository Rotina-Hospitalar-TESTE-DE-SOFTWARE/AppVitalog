import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('vitalog_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('vitalog_auth');
      }
    }
    setLoading(false);
  }, []);

  const registerUser = (name, email, password) => {
    const savedUsers = localStorage.getItem('vitalog_users');
    let users = [];
    if (savedUsers) {
      try {
        users = JSON.parse(savedUsers);
      } catch (e) {
        users = [];
      }
    }
    
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }
    
    const newUser = { name, email: email.toLowerCase(), password };
    users.push(newUser);
    localStorage.setItem('vitalog_users', JSON.stringify(users));
    return { success: true };
  };

  const login = (email, password) => {
    const savedUsers = localStorage.getItem('vitalog_users');
    let users = [];
    if (savedUsers) {
      try {
        users = JSON.parse(savedUsers);
      } catch (e) {
        users = [];
      }
    }
    
    // Inserir usuário de teste padrão se a lista de usuários estiver limpa
    const hasDefault = users.some(u => u.email === 'admin@vitalog.com');
    if (!hasDefault && users.length === 0) {
      const defaultUser = { name: 'Administrador', email: 'admin@vitalog.com', password: 'vitalog123' };
      users.push(defaultUser);
      localStorage.setItem('vitalog_users', JSON.stringify(users));
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      const sessionData = { name: user.name, email: user.email };
      localStorage.setItem('vitalog_auth', JSON.stringify(sessionData));
      setUser(sessionData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vitalog_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, registerUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
