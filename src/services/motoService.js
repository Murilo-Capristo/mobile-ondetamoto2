import { useAuth } from "../context/UserContext";
const BASE_URL = 'http://191.235.235.207:5294/api/Moto';

export async function getMotos() {
  try {
    const res = await fetch(BASE_URL);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar motos:', err);
    throw err;
  }
}

export async function updateMoto(id, data) {
  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Erro ao atualizar moto:', err);
    throw err;
  }
}

export async function deleteMoto(id) {
  try {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Erro ao excluir moto:', err);
    throw err;
  }
}

export async function createMoto(data) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 0, ...data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao cadastrar moto');
    }

    return await response.json();
  } catch (err) {
    console.error('Erro na API de motos:', err);
    throw err;
  }
}
