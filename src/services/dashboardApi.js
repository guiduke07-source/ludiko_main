const API_BASE_URL = 'http://127.0.0.1:5000';

async function buscarJson(url) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Faça login para acessar o painel.');
  }

  const resposta = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok || dados.erro) {
    throw new Error(dados.mensagem || `Erro HTTP ${resposta.status}`);
  }

  return dados;
}

export async function listarFilhos() {
  const usuarioSalvo = sessionStorage.getItem('usuario');
  if (!usuarioSalvo) return [];

  try {
    const usuario = JSON.parse(usuarioSalvo);

    // 1. Prioridade para lista com nomes já injetada
    if (Array.isArray(usuario.filhos) && usuario.filhos.length > 0) {
      return usuario.filhos.map((f) => ({
        id: f.id || f._id,
        nome: f.nome,
      }));
    }

    // 2. Busca para os IDs do seu console: ["6a917cc2d447ee1302008431", "6a93619d17ab57c2c753402b"]
    const ids = usuario.criancas_ids || [];
    if (ids.length > 0) {
      const promessas = ids.map(async (id, index) => {
        try {
          const res = await buscarJson(`${API_BASE_URL}/api/crianca/${id}`);
          return {
            id: id,
            nome: res.nome || res.crianca?.nome || `Criança ${index + 1}`,
          };
        } catch (err) {
          console.error(`Erro ao buscar dados da criança ${id}:`, err);
          return { id: id, nome: `Criança ${index + 1}` };
        }
      });

      return await Promise.all(promessas);
    }
  } catch (err) {
    console.error('Erro ao ler filhos da sessão:', err);
  }

  return [];
}

export async function buscarDadosDashboard(criancaId) {
  if (!criancaId) {
    throw new Error('Nenhuma criança selecionada.');
  }

  const [frequenciaResposta, progressoResposta] = await Promise.all([
    buscarJson(`${API_BASE_URL}/api/frequencia/crianca/${criancaId}`),
    buscarJson(`${API_BASE_URL}/api/progresso/crianca/${criancaId}`),
  ]);

  return {
    frequencia: frequenciaResposta.frequencia || [],
    progresso: progressoResposta.progresso || [],
  };
}