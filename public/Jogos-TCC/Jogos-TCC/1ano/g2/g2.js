let reiniciarJogoCompleto;

document.addEventListener('DOMContentLoaded', () => {

  const bancoObjetos = [
    { nome: 'Caixa de Suco', arquivo: 'caixaSuco.png', tipo: 'papel' },
    { nome: 'Embalagem de Plastico', arquivo: 'embaplast.png', tipo: 'plastico' },
    { nome: 'Garrafa de Vidro', arquivo: 'garrafaVidro.png', tipo: 'vidro' },
    { nome: 'Graveto', arquivo: 'graveto.png', tipo: 'papel' },
    { nome: 'Lata de Metal', arquivo: 'latinha.png', tipo: 'metal' },
    { nome: 'Resto de Comida', arquivo: 'macacomida.png', tipo: 'papel' }
  ];

  let vidas = 3;
  let filaObjetos = [];
  let objetoAtual = null;

  let acertosPartida = 0;
  let errosPartida = 0;
  let inicioPartida = Date.now();
  let partidaFinalizada = false;

  let audioContext = null;
  let musicaTocando = false;
  let intervaloMusica = null;

  const imgObjetoAtual = document.getElementById('objeto-atual');
  const lixeirasCards = document.querySelectorAll('.lixeira-card');
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

  function iniciarAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function tocarSomSucesso() {
    iniciarAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.setValueAtTime(523.25, audioContext.currentTime);
    osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    osc.start();
    osc.stop(audioContext.currentTime + 0.4);
  }

  function tocarSomErro() {
    iniciarAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.setValueAtTime(180, audioContext.currentTime);
    osc.frequency.setValueAtTime(110, audioContext.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
  }

  function iniciarMusica() {
    iniciarAudio();
    if (musicaTocando) return;
    musicaTocando = true;

    const notas = [261, 329, 392, 329, 293, 349, 440, 349];
    let indice = 0;

    intervaloMusica = setInterval(() => {
      const agora = audioContext.currentTime;
      const oscilador = audioContext.createOscillator();
      const ganho = audioContext.createGain();

      oscilador.type = "sine";
      oscilador.frequency.value = notas[indice];
      ganho.gain.setValueAtTime(0.018, agora);
      ganho.gain.exponentialRampToValueAtTime(0.001, agora + 0.5);

      oscilador.connect(ganho);
      ganho.connect(audioContext.destination);
      oscilador.start(agora);
      oscilador.stop(agora + 0.5);

      indice = (indice + 1) % notas.length;
    }, 600);
  }

  function falarInstrucao() {
    if ('speechSynthesis' in window && objetoAtual) {
      window.speechSynthesis.cancel();
      const mensagem = new SpeechSynthesisUtterance(`Onde jogamos este lixo? É o ${objetoAtual.nome}`);
      mensagem.lang = 'pt-BR';
      mensagem.rate = 0.9;
      window.speechSynthesis.speak(mensagem);
    }
  }

  function iniciarJogo() {
    vidas = 3;
    atualizarVidas();
    filaObjetos = [...bancoObjetos].sort(() => Math.random() - 0.5);
    modal.classList.remove('ativa');
    proximoObjeto();
  }

  function proximoObjeto() {
    if (filaObjetos.length === 0) {
      enviarResultadoFinal("Ciências");
      modal.classList.remove('ativa');
      if (modalFim) modalFim.style.display = 'flex';
      return;
    }

    objetoAtual = filaObjetos.pop();
    imgObjetoAtual.src = `img/${objetoAtual.arquivo}`;
    imgObjetoAtual.style.opacity = '1';

    falarInstrucao();
  }

  imgObjetoAtual.addEventListener('dragstart', (e) => {
    iniciarMusica();
    e.dataTransfer.setData('text/plain', objetoAtual.tipo);
  });

  lixeirasCards.forEach(card => {
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const tipoEscolhido = card.getAttribute('data-tipo');
      verificarResposta(tipoEscolhido);
    });

    card.addEventListener('click', () => {
      iniciarMusica();
      if (objetoAtual) verificarResposta(card.getAttribute('data-tipo'));
    });
  });

  function verificarResposta(tipoEscolhido) {
    if (tipoEscolhido === objetoAtual.tipo) {
      acertosPartida++;
      tocarSomSucesso();
      imgObjetoAtual.style.opacity = '0';
      setTimeout(proximoObjeto, 300);
    } else {
      errosPartida++;
      tocarSomErro();
      vidas--;
      atualizarVidas();

      if (vidas === 0) {
        enviarResultadoFinal("Ciências");
        exibirModal('Fim de jogo!', 'Suas vidas acabaram. Tente novamente!');
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

  function exibirModal(titulo, texto) {
    setTimeout(() => {
      modalTitulo.textContent = titulo;
      modalMensagem.textContent = texto;
      modal.classList.add('ativa');
    }, 300);
  }

  btnSom.addEventListener('click', () => {
    iniciarMusica();
    falarInstrucao();
  });

  btnHome.addEventListener('click', () => {
    window.location.href = "/Inicioreal";
  });

  btnReiniciar.addEventListener('click', () => {
    acertosPartida = 0;
    errosPartida = 0;
    inicioPartida = Date.now();
    partidaFinalizada = false;
    iniciarJogo();
  });

  reiniciarJogoCompleto = function() {
    if (modalFim) modalFim.style.display = 'none';
    vidas = 3;
    atualizarVidas();
    acertosPartida = 0;
    errosPartida = 0;
    inicioPartida = Date.now();
    partidaFinalizada = false;
    iniciarJogo();
  };

  iniciarJogo();
});