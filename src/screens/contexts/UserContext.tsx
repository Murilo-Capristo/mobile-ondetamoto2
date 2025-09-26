// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UsuarioType = {
  user: string;
};

type AuthContextType = {
  usuario: UsuarioType | null;
  setUsuario: (usuario: UsuarioType) => void;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuarioState] = useState<UsuarioType | null>(null);

  useEffect(() => {
    const loadUsuario = async () => {
      const storedUsuario = await AsyncStorage.getItem('usuario');
      if (storedUsuario) {
        setUsuarioState(JSON.parse(storedUsuario));
      }
    };
    loadUsuario();
  }, []);

  const setUsuario = async (newUsuario: UsuarioType) => {
    await AsyncStorage.setItem('usuario', JSON.stringify(newUsuario));
    setUsuarioState(newUsuario);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
