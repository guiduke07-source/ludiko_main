/* Elementos da página */
const opcoesContainer = document.getElementById("opcoes");
const vidasContainer = document.getElementById("vidas");
const somBtn = document.getElementById("somBtn");
const homeBtn = document.getElementById("homeBtn");
const orientacao = document.getElementById("orientacao");
const mensagem = document.getElementById("mensagem");
const tituloMensagem = document.getElementById("tituloMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const proximoBtn = document.getElementById("proximoBtn");

const peixesImagens = [
    "img/peixeAmarelo.png",
    "img/peixeAzul.png",
    "img/peixeListrado.png",
    "img/peixeVerde.png"
];

const posicoesFixas = [
    { top: 15, left: 15 },
    { top: 10, left: 45 },
    { top: 20, left: 75 },
    { top: 55, left: 25 },
    { top: 50, left: 60 }
];

const desafios = [
    { letra: "A", palavraExemplo: "Água", emoji: "💧", opcoes: ["A", "M", "V", "Z", "G"] },
    { letra: "B", palavraExemplo: "Baleia", emoji: "🐳", opcoes: ["B", "P", "D", "R", "S"] },
    { letra: "C", palavraExemplo: "Concha", emoji: "🐚", opcoes: ["C", "G", "O", "T", "L"] },
    { letra: "E", palavraExemplo: "Estrela", emoji: "⭐", opcoes: ["E", "I", "U", "A", "F"] },
    { letra: "P", palavraExemplo: "Peixe", emoji: "🐠", opcoes: ["P", "B", "T", "M", "N"] },
    { letra: "T", palavraExemplo: "Tubarão", emoji: "🦈", opcoes: ["T", "D", "F", "P", "V"] }
];

let desafioAtual = 0;
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

    const notas = [261.63, 329.63, 392.00, 440.00, 523.25, 392.00];
    let indice = 0;

    intervaloMusica = setInterval(() => {
        const agora = audioContext.currentTime;
        const oscilador = audioContext.createOscillator();
        const ganho = audioContext.createGain();

        oscilador.type = "sine";
        oscilador.frequency.value = notas[indice];
        ganho.gain.setValueAtTime(0.012, agora);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + 0.8);

        oscilador.connect(ganho);
        ganho.connect(audioContext.destination);
        oscilador.start(agora);
        oscilador.stop(agora + 0.8);

        indice = (indice + 1) % notas.length;
    }, 700);
}

function falarOrientacao() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const item = desafios[desafioAtual];
    const texto = `Aperte na letra inicial de ${item.palavraExemplo}`;
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1.1;

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
    const desafio = desafios[desafioAtual];
    const opcoesEmbaralhadas = [...desafio.opcoes].sort(() => Math.random() - 0.5);
    const posicoesEmbaralhadas = [...posicoesFixas].sort(() => Math.random() - 0.5);

    opcoesEmbaralhadas.forEach((letra, index) => {
        const pos = posicoesEmbaralhadas[index];
        const imgPeixe = peixesImagens[index % peixesImagens.length];

        const botaoPeixe = document.createElement("button");
        botaoPeixe.type = "button";
        botaoPeixe.classList.add("peixe-opcao");
        botaoPeixe.style.top = `${pos.top}%`;
        botaoPeixe.style.left = `${pos.left}%`;
        botaoPeixe.style.animationDelay = `${(index * 0.4).toFixed(1)}s`;

        const img = document.createElement("img");
        img.src = imgPeixe;
        img.alt = `Peixe com opção de letra`;

        const spanLetra = document.createElement("span");
        spanLetra.classList.add("letra-texto");
        spanLetra.textContent = letra;

        botaoPeixe.appendChild(img);
        botaoPeixe.appendChild(spanLetra);
        botaoPeixe.setAttribute("aria-label", `Letra ${letra}`);

        botaoPeixe.addEventListener("click", () => verificarResposta(letra, botaoPeixe));
        opcoesContainer.appendChild(botaoPeixe);
    });
}

function verificarResposta(letra, botao) {
    const desafio = desafios[desafioAtual];

    if (letra === desafio.letra) {
        acertosPartida++;
        const peixes = document.querySelectorAll(".peixe-opcao");
        peixes.forEach(p => p.style.pointerEvents = "none");
        somAcerto();
        setTimeout(faseConcluida, 600);
        return;
    }

    somErro();
    errosPartida++;
    botao.style.transform = "scale(0.85)";
    setTimeout(() => { botao.style.transform = ""; }, 200);
    perderVida();
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
    textoMensagem.textContent = "Ah que pena, você ficou sem vidas. Não desista!";
    proximoBtn.textContent = "Tentar Novamente";
    mensagem.classList.add("ativa");
    proximoBtn.onclick = reiniciarDesafio;
    proximoBtn.focus();
}

function faseConcluida() {
    somVitoria();
    tituloMensagem.textContent = "Parabéns!";
    textoMensagem.textContent = `Você encontrou a letra correta!`;

    const ultimaFase = desafioAtual >= desafios.length - 1;
    if (ultimaFase) {
        proximoBtn.textContent = "Jogar Novamente";
        enviarResultadoFinal("Português");
        proximoBtn.onclick = () => {
            desafioAtual = 0;
            vidas = 3;
            acertosPartida = 0;
            errosPartida = 0;
            inicioPartida = Date.now();
            partidaFinalizada = false;
            mensagem.classList.remove("ativa");
            carregarDesafio();
        };
    } else {
        proximoBtn.textContent = "Próxima Letra";
        proximoBtn.onclick = proximoDesafio;
    }

    mensagem.classList.add("ativa");
    proximoBtn.focus();
}

function proximoDesafio() {
    mensagem.classList.remove("ativa");
    desafioAtual++;
    if (desafioAtual >= desafios.length) {
        desafioAtual = 0;
    }
    vidas = 3;
    carregarDesafio();
}

function reiniciarDesafio() {
    mensagem.classList.remove("ativa");
    vidas = 3;
    carregarDesafio();
}

function carregarDesafio() {
    const item = desafios[desafioAtual];
    orientacao.innerHTML = `<p>Clique na letra inicial de ${item.emoji} <strong>${item.palavraExemplo}</strong></p>`;
    criarOpcoes();
    atualizarVidas();
    setTimeout(falarOrientacao, 600);
}

somBtn.addEventListener("click", () => {
    iniciarAudio();
    controlarOrientacao();
});

homeBtn.addEventListener("click", () => {
    window.location.href = "/Inicioreal";
});

document.addEventListener("click", () => iniciarMusica(), { once: true });

carregarDesafio();