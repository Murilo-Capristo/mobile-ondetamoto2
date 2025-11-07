import { useAuth } from '../context/UserContext';
import { BASE_URL } from '../config/constants';

export function useMotoService() {
  const { user } = useAuth(); // pega o token do contexto
  const URL = `${BASE_URL}/api/motos`;

  const getMotos = async (pageNumber: number) => {
    try {
      console.log('Chamando URL:', `${BASE_URL}/api/motos`);
      console.log("Usuário: ", user)
      console.log("Token atual:", user?.token);


      const res = await fetch(`${URL}?page=${pageNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Erro ao buscar motos');
      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar motos:', err);
      throw err;
    }
  };

  const createMoto = async (data: any) => {
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
        throw new Error(errorText || 'Erro ao cadastrar moto');
      }

      return await response.json();
    } catch (err) {
      console.error('Erro ao cadastrar moto:', err);
      throw err;
    }
  };

  const updateMoto = async (id: number, data: any) => {
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
      console.error('Erro ao atualizar moto:', err);
      throw err;
    }
  };

  const deleteMoto = async (id: number) => {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    } catch (err) {
      console.error('Erro ao excluir moto:', err);
      throw err;
    }
  };

  return { getMotos, createMoto, updateMoto, deleteMoto };
}
