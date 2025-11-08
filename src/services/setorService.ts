import { useAuth } from '../context/UserContext';
import { BASE_URL } from '../config/constants';

export function useSetorService() {
  const { user } = useAuth(); // pega o token do contexto
  const URL = `${BASE_URL}/api/setores`;

  const getSetores = async (pageNumber: number) => {
    try {
      const res = await fetch(`${URL}?page=${pageNumber}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Erro ao buscar setores');
      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar setores:', err);
      throw err;
    }
  };

  const updateSetor = async (id: number, data: any) => {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html') || text.includes('<html')) {
          throw new Error('O login falhou. Verifique as credenciais.');
        }
        throw new Error(text || 'Erro ao cadastrar setor');
      }

      return;
    } catch (err) {
      console.error('Erro na API de setores:', err);
      throw err;
    }
  };

  const deleteSetor = async (id: number) => {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    } catch (err) {
      console.error('Erro ao excluir setor:', err);
      throw err;
    }
  };

  const createSetor = async (data: any) => {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      });

      if (!response.ok) {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html') || text.includes('<html')) {
          throw new Error('O login falhou. Verifique as credenciais.');
        }
        throw new Error(text || 'Erro ao cadastrar setor');
      }

      return;
    } catch (err) {
      console.error('Erro na API de setores:', err);
      throw err;
    }
  };

  return { createSetor, deleteSetor, updateSetor, getSetores };
}
