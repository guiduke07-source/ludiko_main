const API_BASE_URL = 'http://127.0.0.1:5000';

export async function cadastrarCrianca(dadosCrianca) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Faça login para cadastrar uma criança.');
  }

  const resposta = await fetch(`${API_BASE_URL}/api/criancas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dadosCrianca),
  });

  const dados = await resposta.json();

  if (!resposta.ok || dados.erro) {
    throw new Error(
      dados.mensagem || 'Não foi possível cadastrar a criança.'
    );
  }

  return dados;
}