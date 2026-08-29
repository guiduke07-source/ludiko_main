/* Referências dos Elementos DOM */
const orientacaoTexto = document.getElementById("orientacaoTexto");
const num1El = document.getElementById("num1");
const operadorEl = document.getElementById("operador");
const lacunaEl = document.getElementById("lacuna");
const resultadoEl = document.getElementById("resultado");
const opcoesContainer = document.getElementById("opcoesContainer");
const vidasContainer = document.getElementById("vidas");
const somBtn = document.getElementById("somBtn");
const homeBtn = document.getElementById("homeBtn");
const mensagem = document.getElementById("mensagem");
const tituloMensagem = document.getElementById("tituloMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const proximoBtn = document.getElementById("proximoBtn");

const desafios = [
    { num1: 10, operador: "+", resultado: 12, respostaCorreta: 2, opcoes: [1, 6, 2, 5, 8] },
    { num1: 15, operador: "-", resultado: 10, respostaCorreta: 5, opcoes: [3, 5, 2, 7, 4] },
    { num1: 8, operador: "+", resultado: 15, respostaCorreta: 7, opcoes: [6, 9, 7, 5, 4] },
    { num1: 20, operador: "-", resultado: 12, respostaCorreta: 8, opcoes: [8, 5, 10, 6, 7] },
    { num1: 12, operador: "-", resultado: 7, respostaCorreta: 5, opcoes: [4, 5, 3, 6, 2] }
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
    oscilador.frequency.setValueAtTime(523.25, agora);
    oscilador.frequency.exponentialRampToValueAtTime(880, agora + 0.2);

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
    oscilador.frequency.setValueAtTime(220, agora);
    oscilador.frequency.exponentialRampToValueAtTime(110, agora + 0.25);

    ganho.gain.setValueAtTime(0.15, agora);
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.3);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start(agora);
    oscilador.stop(agora + 0.3);
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
    }, 750);
}

function falarOrientacao() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const desafio = desafios[desafioAtual];
    let texto = desafio.operador === "+"
        ? `Descubra qual número falta para completar a conta! ${desafio.num1} mais quanto é igual a ${desafio.resultado}?`
        : `Descubra qual número falta para completar a conta! ${desafio.num1} menos quanto é igual a ${desafio.resultado}?`;

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

function carregarDesafio() {
    const desafio = desafios[desafioAtual];
    orientacaoTexto.textContent = "Escolha o número que completa a conta corretamente:";
    num1El.textContent = desafio.num1;
    operadorEl.textContent = desafio.operador;
    resultadoEl.textContent = desafio.resultado;
    lacunaEl.textContent = "_";

    opcoesContainer.innerHTML = "";
    desafio.opcoes.forEach((opcao) => {
        const btn = document.createElement("button");
        btn.classList.add("btn-opcao");
        btn.textContent = opcao;
        btn.setAttribute("aria-label", `Opção ${opcao}`);
        btn.addEventListener("click", () => verificarResposta(opcao));
        opcoesContainer.appendChild(btn);
    });

    atualizarVidas();
    setTimeout(falarOrientacao, 500);
}

function verificarResposta(opcaoEscolhida) {
    const desafio = desafios[desafioAtual];

    if (opcaoEscolhida === desafio.respostaCorreta) {
        acertosPartida++;
        lacunaEl.textContent = opcaoEscolhida;
        somAcerto();

        tituloMensagem.textContent = "Parabéns!";
        textoMensagem.textContent = `Você acertou! ${desafio.num1} ${desafio.operador} ${opcaoEscolhida} = ${desafio.resultado}`;

        const ultimaFase = desafioAtual >= desafios.length - 1;
        proximoBtn.textContent = ultimaFase ? "Jogar Novamente" : "Próximo Desafio";

        if (ultimaFase) {
            enviarResultadoFinal("Matemática");
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
            proximoBtn.onclick = proximoDesafio;
        }

        mensagem.classList.add("ativa");
        proximoBtn.focus();
    } else {
        errosPartida++;
        somErro();
        perderVida();
    }
}

function perderVida() {
    vidas--;
    atualizarVidas();
    if (vidas <= 0) gameOver();
}

function gameOver() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    enviarResultadoFinal("Matemática");
    tituloMensagem.textContent = "Tente Novamente!";
    textoMensagem.textContent = "Suas vidas acabaram. Quer tentar mais uma vez?";
    proximoBtn.textContent = "Tentar Novamente";
    mensagem.classList.add("ativa");
    proximoBtn.focus();
    proximoBtn.onclick = reiniciarJogo;
}

function proximoDesafio() {
    mensagem.classList.remove("ativa");
    desafioAtual = (desafioAtual + 1) % desafios.length;
    vidas = 3;
    carregarDesafio();
}

function reiniciarJogo() {
    mensagem.classList.remove("ativa");
    desafioAtual = 0;
    vidas = 3;
    carregarDesafio();
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