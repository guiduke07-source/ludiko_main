// Aguarda todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. VARIÁVEIS DE ESTADO (STATE) DO JOGO
     ========================================== */
  let vidas = 3;           // Quantidade de tentativas do jogador
  let numeroObjetivo = 0;  // O número que a criança precisa acertar na rodada
  let opcoesNumeros = [];  // Lista com os 5 números que vão aparecer nos balões


  /* ==========================================
     2. MAPEAMENTO DOS ELEMENTOS DO HTML (DOM)
     ========================================== */
  const baloesContainer = document.getElementById('baloes-container'); // Onde os balões são renderizados
  const elementoAlvo = document.getElementById('numero-alvo');         // O texto que mostra o número procurado
  const elementosVidas = document.querySelectorAll('.coracao');        // Lista com as 3 imagens de coração
  const btnSom = document.getElementById('btn-som');                   // Botão de ouvir o áudio da instrução
  const btnHome = document.getElementById('btn-home');                 // Botão de voltar ao início
  const modal = document.getElementById('modal-feedback');             // Janela pop-up de vitória/game over
  const modalTitulo = document.getElementById('modal-titulo');         // Título da janela pop-up
  const modalMensagem = document.getElementById('modal-mensagem');     // Mensagem da janela pop-up
  const btnReiniciar = document.getElementById('btn-reiniciar');       // Botão de tentar de novo na pop-up


  /* ==========================================
     3. LÓGICA DE GERAÇÃO DE NÚMEROS (SORTEIO)
     ========================================== */
  function gerarNovaRodada() {
    // Usamos 'Set' para garantir que não existam números repetidos na mesma rodada
    const conjuntoNumeros = new Set();
    
    // Sorteia 5 números aleatórios e únicos entre 1 e 30
    while (conjuntoNumeros.size < 5) {
      const numAleatorio = Math.floor(Math.random() * 30) + 1;
      conjuntoNumeros.add(numAleatorio);
    }

    // Converte o Set de volta para um Array (lista normal)
    opcoesNumeros = Array.from(conjuntoNumeros);

    // Escolhe aleatoriamente UM dos 5 números da lista para ser a resposta correta
    numeroObjetivo = opcoesNumeros[Math.floor(Math.random() * opcoesNumeros.length)];
  }


  /* ==========================================
     4. EFEITOS SONOROS (WEB AUDIO API)
     ========================================== */
  // Cria o contexto de áudio do navegador (gera sons sintetizados sem precisar carregar arquivos MP3)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Toca uma sequência rápida de notas agudas quando o jogador acerta
  function tocarSomSucesso() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Frequências das notas musicais (Dó, Mi, Sol)
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);       // C5
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
    
    // Esmaecimento gradual do volume
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  }

  // Toca um som grave ("dissonante") quando o jogador erra
  function tocarSomErro() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; // Onda tipo 'dente de serra' gera um som mais "áspero"
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.setValueAtTime(110, audioCtx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  /* ==========================================
     5. SÍNTESE DE VOZ (SPOKEN INSTRUCTION)
     ========================================== */
  // Usa o leitor de voz nativo do navegador para falar a instrução para a criança
  function falarInstrucao() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Para qualquer fala que esteja acontecendo antes
      const mensagem = new SpeechSynthesisUtterance(`Estoure o balão com o número ${numeroObjetivo}`);
      mensagem.lang = 'pt-BR'; // Define o idioma para português do Brasil
      mensagem.rate = 0.9;     // Fala em uma velocidade ligeiramente reduzida para facilitar a compreensão
      window.speechSynthesis.speak(mensagem);
    }
  }


  /* ==========================================
     6. CICLO DE JOGO (INICIALIZAÇÃO E RENDER)
     ========================================== */
  function iniciarJogo() {
    vidas = 3;             // Reseta o contador de vidas
    atualizarVidas();      // Atualiza a visualização dos corações
    gerarNovaRodada();     // Sorteia os novos números

    modal.classList.remove('ativa');      // Esconde o modal caso esteja aberto
    baloesContainer.innerHTML = '';        // Limpa os balões antigos da tela
    elementoAlvo.textContent = numeroObjetivo; // Atualiza o número do objetivo na tela

    // Cria dinamicamente as <div> dos 5 balões na tela
    opcoesNumeros.forEach((num) => {
      const balao = document.createElement('div');
      balao.classList.add('balao-item');

      const texto = document.createElement('span');
      texto.classList.add('balao-texto');
      texto.textContent = num;

      balao.appendChild(texto);
      
      // Adiciona o evento de clique em cada balão individualmente
      balao.addEventListener('click', () => verificarEscolha(num, balao));
      baloesContainer.appendChild(balao);
    });

    falarInstrucao(); // Narra a instrução no início da rodada
  }


  /* ==========================================
     7. LÓGICA DE REGRAS E INTERAÇÃO
     ========================================== */
  function verificarEscolha(numero, elementoBalao) {
    // Se o balão já foi estourado, ignora novos cliques
    if (elementoBalao.classList.contains('estourado')) return;

    // Aplica a classe CSS para fazer o balão desaparecer com animação
    elementoBalao.classList.add('estourado');

    // Condição de ACERTO
    if (numero === numeroObjetivo) {
      tocarSomSucesso();
      exibirModal('Parabéns!', 'Você encontrou o número correto!');
    } 
    // Condição de ERRO
    else {
      tocarSomErro();
      vidas--;             // Diminui 1 vida
      atualizarVidas();    // Apaga um coração

      // Condição de GAME OVER
      if (vidas === 0) {
        exibirModal('Fim de jogo!', 'Suas vidas acabaram. Tente novamente!');
      }
    }
  }

  // Atualiza a opacidade/cor dos corações dependendo do número de vidas restantes
  function atualizarVidas() {
    elementosVidas.forEach((coracao, index) => {
      if (index < vidas) {
        coracao.classList.remove('perdida'); // Fica visível/colorido
      } else {
        coracao.classList.add('perdida');    // Fica cinza/apagado
      }
    });
  }

  // Exibe a tela de aviso (Modal) com um leve atraso para dar tempo da animação terminar
  function exibirModal(titulo, texto) {
    setTimeout(() => {
      modalTitulo.textContent = titulo;
      modalMensagem.textContent = texto;
      modal.classList.add('ativa');
    }, 400);
  }


  /* ==========================================
     8. EVENTOS DE BOTÕES E INÍCIO AUTOMÁTICO
     ========================================== */
  btnSom.addEventListener('click', falarInstrucao);        // Botão de repetição de áudio
  btnHome.addEventListener('click', () => location.reload());// Botão de recarregar a página
  btnReiniciar.addEventListener('click', iniciarJogo);    // Botão de reiniciar no modal

  // Inicia o jogo automaticamente ao carregar a página
  iniciarJogo();
});