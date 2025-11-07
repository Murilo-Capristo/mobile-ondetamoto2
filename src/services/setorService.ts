import { useAuth } from '../context/UserContext';
import { BASE_URL } from '../config/constants';


export function useSetorService(){
  const { user } = useAuth(); // pega o token do contexto
  const URL = `${BASE_URL}/api/setores`;


  async function getSetores(pageNumber: number) {
    try {
      const res = await fetch(`${URL}?page=${pageNumber}`, {
        method: "GET",
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
  }

 async function updateSetor(id: number, data: any) {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Erro ao atualizar setor:', err);
      throw err;
    }
  }

 async function deleteSetor(id: number) {
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
  }

 async function createSetor(data: any) {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 0, ...data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar setor');
      }

      return await response.json();
    } catch (err) {
      console.error('Erro na API de setores:', err);
      throw err;
    }
  }

  return {createSetor, deleteSetor, updateSetor, getSetores}
}
