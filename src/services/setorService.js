const BASE_URL = 'http://191.235.235.207:5294/api/Setor';

export async function getSetores() {
  try {
    const res = await fetch(BASE_URL);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar setores:', err);
    throw err;
  }
}

export async function updateSetor(id: number, data: any) {
  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Erro ao atualizar setor:', err);
    throw err;
  }
}

export async function deleteSetor(id: number) {
  try {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Erro ao excluir setor:', err);
    throw err;
  }
}

export async function createSetor(data) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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