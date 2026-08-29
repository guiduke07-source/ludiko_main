const API_BASE_URL = 'http://127.0.0.1:5000';

function obterCriancaIdLogada() {
  const usuarioSalvo = sessionStorage.getItem('usuario');

  if (!usuarioSalvo) {
    throw new Error('Faça login para acessar o painel.');
  }

  const usuario = JSON.parse(usuarioSalvo);
  const criancasIds = usuario.criancas_ids || [];

  if (criancasIds.length > 0) {
    return criancasIds[0];
  }

  return '6a917cc2d447ee1302008431';
}

async function buscarJson(url) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Faça login para acessar o painel.');
  }

  const resposta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok || dados.erro) {
    throw new Error(dados.mensagem || 'Não foi possível carregar os dados.');
  }

  return dados;
}

export async function buscarDadosDashboard() {
  const criancaId = obterCriancaIdLogada();

  const [frequenciaResposta, progressoResposta] = await Promise.all([
    buscarJson(`${API_BASE_URL}/api/frequencia/crianca/${criancaId}`),
    buscarJson(`${API_BASE_URL}/api/progresso/crianca/${criancaId}`),
  ]);

  return {
    frequencia: frequenciaResposta.frequencia || [],
    progresso: progressoResposta.progresso || [],
  };
}