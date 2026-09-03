let reiniciarJogoCompleto;

document.addEventListener('DOMContentLoaded', () => {
  let vidas = 3;
  let numeroObjetivo = 0;
  let opcoesNumeros = [];
  let rodadaAtual = 0;
  const totalRodadas = 5;

  let acertosPartida = 0;
  let errosPartida = 0;
  let inicioPartida = Date.now();
  let partidaFinalizada = false;

  const baloesContainer = document.getElementById('baloes-container');
  const elementoAlvo = document.getElementById('numero-alvo');
  const elementosVidas = document.querySelectorAll('.coracao');
  const btnSom = document.getElementById('btn-som');
  const btnHome = document.getElementById('btn-home');
  const modal = document.getElementById('modal-feedback');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalMensagem = document.getElementById('modal-mensagem');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const modalFim = document.getElementById('modal-fim-jogo');

  function enviarResultadoFinal(materia) {
    if (partidaFinalizada) return;
    partidaFinalizada = true;

    const duracaoSegundos = (Date.now() - inicioPartida) / 1000;
    const minutosReais = Math.max(1, Math.round(duracaoSegundos / 60));

    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const criancaId = sessionStorage.getItem('crianca_ativa_id') || usuario.id || (usuario.criancas_ids && usuario.criancas_ids[0]);

    if (!criancaId) return;

    fetch(`http://127.0.0.1:5000/api/partida/registrar/${criancaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            categoria: materia,
            minutos: minutosReais,
            acertos: acertosPartida,
            erros: errosPartida
        })
    })
    .then(res => res.json())
    .then(dados => console.log('Resultado registrado no painel:', dados))
    .catch(err => console.error('Erro ao enviar pontos:', err));
  }

  function gerarNovaRodada() {
    const conjuntoNumeros = new Set();
    while (conjuntoNumeros.size < 5) {
      const numAleatorio = Math.floor(Math.random() * 30) + 1;
      conjuntoNumeros.add(numAleatorio);
    }
    opcoesNumeros = Array.from(conjuntoNumeros);
    numeroObjetivo = opcoesNumeros[Math.floor(Math.random() * opcoesNumeros.length)];
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function tocarSomSucesso() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  }

  function tocarSomErro() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.setValueAtTime(110, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  function falarInstrucao() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mensagem = new SpeechSynthesisUtterance(`Estoure o balão com o número ${numeroObjetivo}`);
      mensagem.lang = 'pt-BR';
      mensagem.rate = 0.9;
      window.speechSynthesis.speak(mensagem);
    }
  }

  function iniciarJogo() {
    gerarNovaRodada();

    modal.classList.remove('ativa');
    baloesContainer.innerHTML = '';
    elementoAlvo.textContent = numeroObjetivo;

    opcoesNumeros.forEach((num) => {
      const balao = document.createElement('div');
      balao.classList.add('balao-item');

      const texto = document.createElement('span');
      texto.classList.add('balao-texto');
      texto.textContent = num;

      balao.appendChild(texto);
      balao.addEventListener('click', () => verificarEscolha(num, balao));
      baloesContainer.appendChild(balao);
    });

    falarInstrucao();
  }

  function verificarEscolha(numero, elementoBalao) {
    if (elementoBalao.classList.contains('estourado')) return;
    elementoBalao.classList.add('estourado');

    if (numero === numeroObjetivo) {
      acertosPartida++;
      tocarSomSucesso();

      rodadaAtual++;
      if (rodadaAtual >= totalRodadas) {
        enviarResultadoFinal("Matemática");
        modal.classList.remove('ativa');
        if (modalFim) modalFim.style.display = 'flex';
      } else {
        exibirModal('Parabéns!', 'Você encontrou o número correto!');
      }
    } else {
      errosPartida++;
      tocarSomErro();
      vidas--;
      atualizarVidas();

      if (vidas === 0) {
        enviarResultadoFinal("Matemática");
        exibirModal('Fim de jogo!', 'Suas vidas acabaram. Tente novamente!', true);
      }
    }
  }

  function atualizarVidas() {
    elementosVidas.forEach((coracao, index) => {
      if (index < vidas) {
        coracao.classList.remove('perdida');
      } else {
        coracao.classList.add('perdida');
      }
    });
  }

  function exibirModal(titulo, texto, reiniciar = false) {
    setTimeout(() => {
      modalTitulo.textContent = titulo;
      modalMensagem.textContent = texto;
      btnReiniciar.textContent = reiniciar ? "Tentar Novamente" : "Próxima Rodada";
      modal.classList.add('ativa');
    }, 400);
  }

  btnSom.addEventListener('click', falarInstrucao);
  btnHome.addEventListener('click', () => {
    window.location.href = "/Inicioreal";
  });

  btnReiniciar.addEventListener('click', () => {
    if (vidas === 0) {
      vidas = 3;
      atualizarVidas();
      rodadaAtual = 0;
      acertosPartida = 0;
      errosPartida = 0;
      inicioPartida = Date.now();
      partidaFinalizada = false;
    }
    iniciarJogo();
  });

  reiniciarJogoCompleto = function() {
    if (modalFim) modalFim.style.display = 'none';
    vidas = 3;
    atualizarVidas();
    rodadaAtual = 0;
    acertosPartida = 0;
    errosPartida = 0;
    inicioPartida = Date.now();
    partidaFinalizada = false;
    iniciarJogo();
  };

  atualizarVidas();
  iniciarJogo();
});