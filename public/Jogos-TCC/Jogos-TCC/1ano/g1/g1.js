document.addEventListener('DOMContentLoaded', () => {

  // Listagem de animais cadastrados (apenas imagens existentes na pasta img)
  const bancoAnimais = [
    { nome: 'Cobra', arquivo: 'cobra.png', habitat: 'selva' },
    { nome: 'Cachorro', arquivo: 'cachorro.png', habitat: 'floresta' },
    { nome: 'Elefante', arquivo: 'elefante.png', habitat: 'selva' },
    { nome: 'Gato', arquivo: 'gato.png', habitat: 'floresta' },
    { nome: 'Leão', arquivo: 'leao.png', habitat: 'selva' },
    { nome: 'Macaco', arquivo: 'macaco.png', habitat: 'floresta' },
    { nome: 'Peixe', arquivo: 'peixe.png', habitat: 'agua' }
  ];

  let vidas = 3;
  let filaAnimais = [];
  let animalAtual = null;

  // Controle do sistema de áudio por sintetizador
  let audioContext = null;
  let musicaTocando = false;
  let intervaloMusica = null;

  // Elementos do DOM
  const imgAnimalAtual = document.getElementById('animal-atual');
  const habitatsCards = document.querySelectorAll('.habitat-card');
  const elementosVidas = document.querySelectorAll('.coracao');
  const btnSom = document.getElementById('btn-som');
  const btnHome = document.getElementById('btn-home');
  const modal = document.getElementById('modal-feedback');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalMensagem = document.getElementById('modal-mensagem');
  const btnReiniciar = document.getElementById('btn-reiniciar');

  // Inicializa a API de Áudio do navegador
  function iniciarAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Sons de Efeitos
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

  // Música de fundo sintetizada por código
  function iniciarMusica() {
    iniciarAudio();

    if (musicaTocando) {
      return;
    }

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

      indice++;

      if (indice >= notas.length) {
        indice = 0;
      }
    }, 600);
  }

  // Narração de voz da instrução
  function falarInstrucao() {
    if ('speechSynthesis' in window && animalAtual) {
      window.speechSynthesis.cancel();
      const mensagem = new SpeechSynthesisUtterance(`Para onde vai este animal? É o ${animalAtual.nome}`);
      mensagem.lang = 'pt-BR';
      mensagem.rate = 0.9;
      window.speechSynthesis.speak(mensagem);
    }
  }

  // Iniciar / Reiniciar Jogo
  function iniciarJogo() {
    vidas = 3;
    atualizarVidas();

    // Embaralha a lista de animais
    filaAnimais = [...bancoAnimais].sort(() => Math.random() - 0.5);

    modal.classList.remove('ativa');
    proximoAnimal();
  }

  // Carrega o próximo animal da fila
  function proximoAnimal() {
    if (filaAnimais.length === 0) {
      exibirModal('Parabéns!', 'Você ajudou todos os animais a encontrarem seus lares!');
      return;
    }

    animalAtual = filaAnimais.pop();
    imgAnimalAtual.src = `img/${animalAtual.arquivo}`;
    imgAnimalAtual.style.opacity = '1';

    falarInstrucao();
  }

  // Lógica de Drag and Drop (Arrastar e Soltar)
  imgAnimalAtual.addEventListener('dragstart', (e) => {
    iniciarMusica();
    e.dataTransfer.setData('text/plain', animalAtual.habitat);
  });

  habitatsCards.forEach(card => {
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

      const habitatEscolhido = card.getAttribute('data-habitat');
      verificarResposta(habitatEscolhido);
    });

    // Suporte a clique direto para facilitar em telas touch
    card.addEventListener('click', () => {
      iniciarMusica();
      if (animalAtual) verificarResposta(card.getAttribute('data-habitat'));
    });
  });

  // Validação da escolha do Habitat
  function verificarResposta(habitatEscolhido) {
    if (habitatEscolhido === animalAtual.habitat) {
      tocarSomSucesso();
      imgAnimalAtual.style.opacity = '0';
      setTimeout(proximoAnimal, 300);
    } else {
      tocarSomErro();
      vidas--;
      atualizarVidas();

      if (vidas === 0) {
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

  // Eventos de Botões
  btnSom.addEventListener('click', () => {
    iniciarMusica();
    falarInstrucao();
  });

  btnHome.addEventListener('click', () => location.reload());
  btnReiniciar.addEventListener('click', iniciarJogo);

  // Começa o jogo
  iniciarJogo();
});