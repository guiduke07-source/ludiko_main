export async function salvarResultadoJogo(materia, minutos, acertos, erros) {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const criancaId =
      usuario.id ||
      (usuario.criancas_ids && usuario.criancas_ids[0]) ||
      '6a8f9157cce9d683ead3f775';

    const resposta = await fetch(
      `http://127.0.0.1:5000/api/partida/registrar/${criancaId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          categoria: materia,
          minutos: Number(minutos),
          acertos: Number(acertos),
          erros: Number(erros),
        }),
      }
    );

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao salvar partida:', erro);
  }
}