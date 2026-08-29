document.addEventListener('DOMContentLoaded', () => {

  const listaAnimais = [
    { id: 'cachorro', nome: 'Cachorro', arquivo: 'cachorro.png' },
    { id: 'gato', nome: 'Gato', arquivo: 'gato.png' },
    { id: 'leao', nome: 'Leão', arquivo: 'leao.png' },
    { id: 'elefante', nome: 'Elefante', arquivo: 'elefante.png' },
    { id: 'macaco', nome: 'Macaco', arquivo: 'macaco.png' },
    { id: 'cobra', nome: 'Cobra', arquivo: 'cobra.png' },
    { id: 'peixe', nome: 'Peixe', arquivo: 'peixe.png' }
  ];

  let vidas = 3;
  let filaRodadas = [];
  let animalCorreto = null;

  let acertosPartida = 0;
  let errosPartida = 0;
  let inicioPartida = Date.now();
  let partidaFinalizada = false;

  let audioContext = null;
  let musicaTocando = false;
  let intervaloMusica = null;

  const containerAnimais = document.getElementById('animais-container');
  const elementosVidas = document.querySelectorAll('.coracao');
  const btnSom = document.getElementById('btn-som');
  const btnHome = document.getElementById('btn-home');
  const modal = document.getElementById('modal-feedback');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalMensagem = document.getElementById('modal-mensagem');
  const btnReiniciar = document.getElementById('btn-reiniciar');

  function enviarResultadoFinal(materia) {
    if (partidaFinalizada) return;
    partidaFinalizada = true;

    const duracaoSegundos = (Date.now() - inicioPartida) / 1000;
    const minutosReais = Math.max(1, Math.round(duracaoSegundos / 60));

    // Lê a criança ativa da sessão atual
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const criancaId = usuario.id || (usuario.criancas_ids && usuario.criancas_ids[0]) || '6a917cc2d447ee1302008431';

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

  function reproduzirSomDoAnimal(id) {
    iniciarAudio();
    const agora = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    if (id === 'cachorro') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, agora);
      osc.frequency.exponentialRampToValueAtTime(120, agora + 0.15);
      gain.gain.setValueAtTime(0.4, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.2);
      osc.start(agora);
      osc.stop(agora + 0.2);
    } else if (id === 'gato') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, agora);
      osc.frequency.linearRampToValueAtTime(750, agora + 0.2);
      osc.frequency.linearRampToValueAtTime(400, agora + 0.5);
      gain.gain.setValueAtTime(0.2, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.5);
      osc.start(agora);
      osc.stop(agora + 0.5);
    } else if (id === 'leao') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, agora);
      osc.frequency.linearRampToValueAtTime(60, agora + 0.6);
      gain.gain.setValueAtTime(0.5, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.6);
      osc.start(agora);
      osc.stop(agora + 0.6);
    } else if (id === 'elefante') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, agora);
      osc.frequency.linearRampToValueAtTime(550, agora + 0.2);
      osc.frequency.linearRampToValueAtTime(250, agora + 0.5);
      gain.gain.setValueAtTime(0.3, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.5);
      osc.start(agora);
      osc.stop(agora + 0.5);
    } else if (id === 'macaco') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, agora);
      osc.frequency.setValueAtTime(850, agora + 0.1);
      gain.gain.setValueAtTime(0.2, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.25);
      osc.start(agora);
      osc.stop(agora + 0.25);
    } else if (id === 'cobra') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, agora);
      osc.frequency.linearRampToValueAtTime(950, agora + 0.4);
      gain.gain.setValueAtTime(0.15, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.4);
      osc.start(agora);
      osc.stop(agora + 0.4);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, agora);
      osc.frequency.linearRampToValueAtTime(500, agora + 0.2);
      gain.gain.setValueAtTime(0.2, agora);
      gain.gain.exponentialRampToValueAtTime(0.01, aluno => 0.3);
      osc.start(agora);
      osc.stop(agora + 0.3);
    }
  }

  function tocarSomERevelarOrientacao() {
    if (!animalCorreto) return;
    reproduzirSomDoAnimal(animalCorreto.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mensagem = new SpeechSynthesisUtterance('Qual animal faz este som?');
      mensagem.lang = 'pt-BR';
      mensagem.rate = 0.9;
      window.speechSynthesis.speak(mensagem);
    }
  }

  function iniciarJogo() {
    vidas = 3;
    atualizarVidas();
    filaRodadas = [...listaAnimais].sort(() => Math.random() - 0.5);
    modal.classList.remove('ativa');
    proximaRodada();
  }

  function proximaRodada() {
    if (filaRodadas.length === 0) {
      enviarResultadoFinal("Ciências");
      exibirModal('Parabéns!', 'Você acertou todos os sons dos animais!');
      return;
    }

    animalCorreto = filaRodadas.pop();
    const incorretos = listaAnimais
      .filter(a => a.id !== animalCorreto.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const opcoes = [animalCorreto, ...incorretos].sort(() => Math.random() - 0.5);

    containerAnimais.innerHTML = '';
    opcoes.forEach(animal => {
      const card = document.createElement('div');
      card.className = 'animal-card';
      card.setAttribute('data-id', animal.id);

      const img = document.createElement('img');
      img.src = `img/${animal.arquivo}`;
      img.alt = animal.nome;

      card.appendChild(img);
      card.addEventListener('click', () => {
        iniciarMusica();
        verificarEscolha(animal.id);
      });

      containerAnimais.appendChild(card);
    });

    tocarSomERevelarOrientacao();
  }

  function verificarEscolha(idEscolhido) {
    if (idEscolhido === animalCorreto.id) {
      acertosPartida++;
      tocarSomSucesso();
      setTimeout(proximaRodada, 600);
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
    tocarSomERevelarOrientacao();
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

  iniciarJogo();
});