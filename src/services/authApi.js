const API_BASE_URL = 'http://127.0.0.1:5000';

export async function fazerLogin(email, senha) {
  const resposta = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok || dados.erro) {
    throw new Error(dados.mensagem || 'Não foi possível fazer login.');
  }

  return dados;
}