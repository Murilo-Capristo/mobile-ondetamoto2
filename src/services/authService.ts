import { BASE_URL } from '../config/constants';
const URL = BASE_URL + '/api/auth'

export async function login(email: string, senha: string) {
    try {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, senha})
        });
        
        const text = await response.text();
        
        //Se retornar Html, o login falha
        if (text.startsWith('<!DOCTYPE html') || text.includes('<html')) {
            throw new Error('O login falhou. Verifique as credenciais.');
        }
        if (!response.ok) throw new Error(text || 'Erro ao realizar Login.');

    return text;
    } catch (err) {
        console.error('Erro no Login:', err);
        throw err;
    }
}

export async function register(email: string, senha: string, role: string) {
  try {
    const response = await fetch(`${URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, role }),
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || 'Erro ao cadastrar usuário.');

    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text;
    }
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    throw err;
  }
}