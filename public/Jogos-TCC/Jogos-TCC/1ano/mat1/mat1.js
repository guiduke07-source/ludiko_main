/* Elementos da página */
const containerFrutas = document.getElementById("container-frutas");
const cesta = document.getElementById("cesta");
const frutasNaCesta = document.getElementById("frutas-na-cesta");
const btnConfirmar = document.getElementById("btnConfirmar");
const vidasContainer = document.getElementById("vidas");
const somBtn = document.getElementById("somBtn");
const homeBtn = document.getElementById("homeBtn");
const orientacaoTexto = document.getElementById("orientacaoTexto");
const mensagem = document.getElementById("mensagem");
const tituloMensagem = document.getElementById("tituloMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const proximoBtn = document.getElementById("proximoBtn");
const modalFim = document.getElementById("modal-fim-jogo");

const frutasDisponiveis = [
    { nome: "maçã", plural: "maçãs", img: "img/maca.png" },
    { nome: "banana", plural: "bananas", img: "img/banana.png" },
    { nome: "morango", plural: "morangos", img: "img/morango.png" }
];

const desafios = [
    { frutaIndex: 0, quantidadeMeta: 5 },
    { frutaIndex: 1, quantidadeMeta: 3 },
    { frutaIndex: 2, quantidadeMeta: 4 },
    { frutaIndex: 0, quantidadeMeta: 2 },
    { frutaIndex: 1, quantidadeMeta: 6 },
    { frutaIndex: 2, quantidadeMeta: 1 },
    { frutaIndex: 0, quantidadeMeta: 3 }
];

let desafioAtual = 0;
let vidas = 3;
let audioContext = null;
let musicaTocando = false;
let intervaloMusica;
let orientacaoFalando = false;
let frutasAdicionadas = 0;

let acertosPartida = 0;
let errosPartida = 0;
let inicioPartida = Date.now();
let partidaFinalizada = false;

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
}

function somColocarFruta() {
    iniciarAudio();
    const agora = audioContext.currentTime;
    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(400, agora);
    oscilador.frequency.exponentialRampToValueAtTime(800, agora + 0.08);

    ganho.gain.setValueAtTime(0.15, agora);
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.08);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start(agora);
    oscilador.stop(agora + 0.08);
}

function somTirarFruta() {
    iniciarAudio();
    const agora = audioContext.currentTime;
    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(600, agora);
    oscilador.frequency.exponentialRampToValueAtTime(300, agora + 0.08);

    ganho.gain.setValueAtTime(0.15, agora);
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.08);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start(agora);
    oscilador.stop(agora + 0.08);
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

function obterTextoInstrucao() {
    const desafio = desafios[desafioAtual];
    const fruta = frutasDisponiveis[desafio.frutaIndex];
    const nomeFruta = desafio.quantidadeMeta === 1 ? fruta.nome : fruta.plural;
    return `Coloque ${desafio.quantidadeMeta} ${nomeFruta} na cesta!`;
}

function falarOrientacao() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const texto = obterTextoInstrucao();
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
    containerFrutas.innerHTML = "";
    frutasNaCesta.innerHTML = "";
    frutasAdicionadas = 0;

    const desafio = desafios[desafioAtual];
    const frutaObj = frutasDisponiveis[desafio.frutaIndex];

    orientacaoTexto.textContent = obterTextoInstrucao();
    const totalDisponivel = Math.max(desafio.quantidadeMeta + 3, 7);

    for (let i = 0; i < totalDisponivel; i++) {
        const btnFruta = document.createElement("button");
        btnFruta.classList.add("item-fruta");
        btnFruta.setAttribute("aria-label", `${frutaObj.nome}. Pressione para mover para a cesta.`);

        const img = document.createElement("img");
        img.src = frutaObj.img;
        img.alt = "";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.pointerEvents = "none";

        btnFruta.appendChild(img);
        btnFruta.draggable = true;

        btnFruta.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", "fruta");
            btnFruta.classList.add("arrastando");
        });

        btnFruta.addEventListener("click", () => moverParaCesta(btnFruta, frutaObj.nome));
        containerFrutas.appendChild(btnFruta);
    }

    atualizarVidas();
    setTimeout(falarOrientacao, 600);
}

function moverParaCesta(elementoFruta, nomeFruta) {
    if (elementoFruta.parentElement === frutasNaCesta) {
        containerFrutas.appendChild(elementoFruta);
        frutasAdicionadas--;
        somTirarFruta();
    } else {
        frutasNaCesta.appendChild(elementoFruta);
        frutasAdicionadas++;
        somColocarFruta();
    }
}

cesta.addEventListener("dragover", (e) => e.preventDefault());
cesta.addEventListener("drop", (e) => {
    e.preventDefault();
    const frutaArrastada = document.querySelector(".arrastando");
    if (frutaArrastada && frutaArrastada.parentElement !== frutasNaCesta) {
        frutaArrastada.classList.remove("arrastando");
        const desafio = desafios[desafioAtual];
        moverParaCesta(frutaArrastada, frutasDisponiveis[desafio.frutaIndex].nome);
    }
});

btnConfirmar.addEventListener("click", () => {
    const desafio = desafios[desafioAtual];

    if (frutasAdicionadas === desafio.quantidadeMeta) {
        acertosPartida++;
        somAcerto();
        somVitoria();

        const ultimaFase = desafioAtual >= desafios.length - 1;

        if (ultimaFase) {
            enviarResultadoFinal("Matemática");
            mensagem.classList.remove("ativa");
            if (modalFim) modalFim.style.display = "flex";
        } else {
            tituloMensagem.textContent = "Parabéns!";
            textoMensagem.textContent = "Você colocou a quantidade exata de frutas!";
            proximoBtn.textContent = "Próximo Desafio";
            proximoBtn.onclick = proximoDesafio;
            mensagem.classList.add("ativa");
            proximoBtn.focus();
        }
    } else {
        errosPartida++;
        somErro();
        perderVida();
    }
});

function perderVida() {
    vidas--;
    atualizarVidas();
    if (vidas <= 0) gameOver();
}

function gameOver() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    enviarResultadoFinal("Matemática");
    tituloMensagem.textContent = "Tente Novamente!";
    textoMensagem.textContent = "Suas vidas acabaram. Vamos tentar de novo?";
    proximoBtn.textContent = "Tentar Novamente";
    mensagem.classList.add("ativa");
    proximoBtn.focus();
    proximoBtn.onclick = reiniciarDesafio;
}

function proximoDesafio() {
    mensagem.classList.remove("ativa");
    desafioAtual++;
    vidas = 3;
    carregarDesafio();
}

function reiniciarDesafio() {
    mensagem.classList.remove("ativa");
    vidas = 3;
    carregarDesafio();
}

function reiniciarJogoCompleto() {
    if (modalFim) modalFim.style.display = "none";
    desafioAtual = 0;
    vidas = 3;
    acertosPartida = 0;
    errosPartida = 0;
    inicioPartida = Date.now();
    partidaFinalizada = false;
    mensagem.classList.remove("ativa");
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