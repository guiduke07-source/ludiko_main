/* Elementos da página */
const imagemPalavra = document.getElementById("imagemPalavra");
const palavraElemento = document.getElementById("palavra");
const opcoesContainer = document.getElementById("opcoes");
const vidasContainer = document.getElementById("vidas");
const somBtn = document.getElementById("somBtn");
const homeBtn = document.getElementById("homeBtn");
const orientacao = document.getElementById("orientacao");
const mensagem = document.getElementById("mensagem");
const tituloMensagem = document.getElementById("tituloMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const proximoBtn = document.getElementById("proximoBtn");

const palavras = [
    { palavra: "GATO", incompleta: "_ATO", resposta: "G", imagem: "img/gato.png", opcoes: ["G", "P", "R"] },
    { palavra: "PATO", incompleta: "_ATO", resposta: "P", imagem: "img/pato.png", opcoes: ["B", "P", "M"] },
    { palavra: "BOLA", incompleta: "_OLA", resposta: "B", imagem: "img/bola.png", opcoes: ["B", "C", "D"] },
    { palavra: "CASA", incompleta: "C_SA", resposta: "A", imagem: "img/casa.png", opcoes: ["E", "A", "O"] },
    { palavra: "MACACO", incompleta: "MA_ACO", resposta: "C", imagem: "img/macaco.png", opcoes: ["C", "T", "P"] },
    { palavra: "BANANA", incompleta: "B_NANA", resposta: "A", imagem: "img/banana.png", opcoes: ["E", "I", "A"] },
    { palavra: "BONECA", incompleta: "B_NECA", resposta: "O", imagem: "img/boneca.png", opcoes: ["A", "O", "U"] },
    { palavra: "CACHORRO", incompleta: "C_CHORRO", resposta: "A", imagem: "img/cachorro.png", opcoes: ["E", "A", "I"] },
    { palavra: "ELEFANTE", incompleta: "ELEF_NTE", resposta: "A", imagem: "img/elefante.png", opcoes: ["E", "A", "O"] },
    { palavra: "MORANGO", incompleta: "M_RANGO", resposta: "O", imagem: "img/morango.png", opcoes: ["A", "E", "O"] }
];

let palavraAtual = 0;
let vidas = 3;
let audioContext = null;
let musicaTocando = false;
let intervaloMusica;
let orientacaoFalando = false;

let acertosPartida = 0;
let errosPartida = 0;
let inicioPartida = Date.now();
let partidaFinalizada = false;

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
}

function somAcerto() {
    iniciarAudio();
    const agora = audioContext.currentTime;
    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(600, agora);
    oscilador.frequency.exponentialRampToValueAtTime(900, agora + 0.15);

    ganho.gain.setValueAtTime(0.2, agora);
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.3);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start(agora);
    oscilador.stop(agora + 0.3);
}

function somErro() {
    iniciarAudio();
    const agora = audioContext.currentTime;
    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.type = "sawtooth";
    oscilador.frequency.setValueAtTime(180, agora);
    oscilador.frequency.exponentialRampToValueAtTime(100, agora + 0.25);

    ganho.gain.setValueAtTime(0.15, agora);
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.3);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start(agora);
    oscilador.stop(agora + 0.3);
}

function somVitoria() {
    iniciarAudio();
    const notas = [523, 659, 784, 1046];
    notas.forEach((nota, indice) => {
        setTimeout(() => {
            const agora = audioContext.currentTime;
            const oscilador = audioContext.createOscillator();
            const ganho = audioContext.createGain();

            oscilador.type = "sine";
            oscilador.frequency.value = nota;
            ganho.gain.setValueAtTime(0.2, agora);
            ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.4);

            oscilador.connect(ganho);
            ganho.connect(audioContext.destination);
            oscilador.start(agora);
            oscilador.stop(agora + 0.4);
        }, indice * 180);
    });
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

function falarOrientacao() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const palavra = palavras[palavraAtual];
    const texto = `Observe a imagem. Complete a palavra ${palavra.incompleta.toLowerCase()}. Escolha a letra correta entre as três opções.`;
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.pitch = 1.1;
    fala.volume = 1;

    orientacaoFalando = true;
    fala.onend = () => { orientacaoFalando = false; };
    fala.onerror = () => { orientacaoFalando = false; };
    window.speechSynthesis.speak(fala);
}

function controlarOrientacao() {
    if (!("speechSynthesis" in window)) return;
    if (orientacaoFalando || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        orientacaoFalando = false;
        return;
    }
    falarOrientacao();
}

function atualizarVidas() {
    const imagens = vidasContainer.querySelectorAll("img");
    imagens.forEach((imagem, index) => {
        if (index < vidas) {
            imagem.classList.remove("perdida");
        } else {
            imagem.classList.add("perdida");
        }
    });
    vidasContainer.setAttribute("aria-label", `${vidas} ${vidas === 1 ? "vida" : "vidas"} restantes`);
}

function criarOpcoes() {
    opcoesContainer.innerHTML = "";
    const palavra = palavras[palavraAtual];

    palavra.opcoes.forEach(letra => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.classList.add("letra");
        botao.textContent = letra;
        botao.setAttribute("aria-label", `Letra ${letra}`);
        botao.addEventListener("click", () => verificarResposta(letra, botao));
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(letra, botao) {
    const palavra = palavras[palavraAtual];
    const botoes = document.querySelectorAll(".letra");

    if (letra === palavra.resposta) {
        acertosPartida++;
        botoes.forEach(b => b.disabled = true);
        somAcerto();
        botao.classList.add("correta");
        palavraElemento.textContent = palavra.palavra;
        setTimeout(palavraCompleta, 700);
        return;
    }

    somErro();
    errosPartida++;
    botao.classList.add("errada");
    perderVida();

    if (vidas > 0) {
        setTimeout(() => botao.classList.remove("errada"), 500);
    }
}

function perderVida() {
    vidas--;
    atualizarVidas();
    if (vidas <= 0) gameOver();
}

function gameOver() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        orientacaoFalando = false;
    }
    enviarResultadoFinal("Português");
    tituloMensagem.textContent = "Tente novamente!";
    textoMensagem.textContent = "Você ficou sem vidas. Não desista!";
    proximoBtn.textContent = "Tentar novamente";
    mensagem.classList.add("ativa");
    proximoBtn.onclick = reiniciarPalavra;
    proximoBtn.focus();
}

function palavraCompleta() {
    somVitoria();
    tituloMensagem.textContent = "Parabéns!";
    textoMensagem.textContent = `Você completou a palavra ${palavras[palavraAtual].palavra}!`;

    const ultimaPalavra = palavraAtual >= palavras.length - 1;
    if (ultimaPalavra) {
        proximoBtn.textContent = "Jogar novamente";
        enviarResultadoFinal("Português");
        proximoBtn.onclick = () => {
            palavraAtual = 0;
            vidas = 3;
            acertosPartida = 0;
            errosPartida = 0;
            inicioPartida = Date.now();
            partidaFinalizada = false;
            mensagem.classList.remove("ativa");
            carregarPalavra();
        };
    } else {
        proximoBtn.textContent = "Próxima palavra";
        proximoBtn.onclick = proximaPalavra;
    }

    mensagem.classList.add("ativa");
    proximoBtn.focus();
}

function proximaPalavra() {
    mensagem.classList.remove("ativa");
    palavraAtual++;
    if (palavraAtual >= palavras.length) {
        palavraAtual = 0;
    }
    vidas = 3;
    carregarPalavra();
}

function reiniciarPalavra() {
    mensagem.classList.remove("ativa");
    vidas = 3;
    carregarPalavra();
}

function carregarPalavra() {
    const palavra = palavras[palavraAtual];
    imagemPalavra.src = palavra.imagem;
    imagemPalavra.alt = `Imagem de ${palavra.palavra.toLowerCase()}`;
    palavraElemento.textContent = palavra.incompleta;
    orientacao.textContent = "Escolha a letra que completa a palavra.";
    criarOpcoes();
    atualizarVidas();
}

somBtn.addEventListener("click", () => {
    iniciarAudio();
    controlarOrientacao();
});

homeBtn.addEventListener("click", () => {
    window.location.href = "/Inicioreal";
});

document.addEventListener("click", () => iniciarMusica(), { once: true });

carregarPalavra();
setTimeout(falarOrientacao, 1000);