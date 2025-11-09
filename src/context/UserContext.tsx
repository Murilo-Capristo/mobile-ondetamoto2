import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Tipagem do usuário logado
type User = {
  email: string;
  token: string;
};

//Tipagem do contexto de autenticação
type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

//Criando contexto vazio com valores padrão
const AuthContext = createContext<AuthContextType | null>(null);

//Provedor de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  //Ao iniciar o app, tenta recuperar o último usuário salvo no AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUserState(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  //Atualiza o estado e salva o usuário + token localmente
  const setUser = async (newUser: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUserState(newUser);
  };

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
