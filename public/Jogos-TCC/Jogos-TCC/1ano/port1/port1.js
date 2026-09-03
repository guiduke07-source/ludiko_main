/* Elementos da página */
const imagemPalavra = document.getElementById("imagemPalavra");
const silabasContainer = document.getElementById("silabas");
const vagoes = document.querySelectorAll(".vagao");
const vidasContainer = document.getElementById("vidas");
const somBtn = document.getElementById("somBtn");
const homeBtn = document.getElementById("homeBtn");
const mensagem = document.getElementById("mensagem");
const tituloMensagem = document.getElementById("tituloMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const proximoBtn = document.getElementById("proximoBtn");
const modalFim = document.getElementById("modal-fim-jogo");

const palavras = [
    { palavra: "BONECA", imagem: "img/boneca.png", silabas: ["BO", "NE", "CA"] },
    { palavra: "BANANA", imagem: "img/banana.png", silabas: ["BA", "NA", "NA"] },
    { palavra: "MACACO", imagem: "img/macaco.png", silabas: ["MA", "CA", "CO"] },
    { palavra: "MORANGO", imagem: "img/morango.png", silabas: ["MO", "RAN", "GO"] },
    { palavra: "CACHORRO", imagem: "img/cachorro.png", silabas: ["CA", "CHO", "RRO"] },
    { palavra: "VASSOURA", imagem: "img/vassoura.png", silabas: ["VA", "SSOU", "RA"] }
];

let palavraAtual = 0;
let vidas = 3;
let silabaSelecionada = null;
let audioContext = null;
let musicaTocando = false;
let intervaloMusica;

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
    const texto = `Observe a imagem. A palavra é ${palavra.palavra.toLowerCase()}. Escolha as sílabas e coloque nos vagões na ordem correta.`;
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.8;
    fala.pitch = 1.1;
    fala.volume = 1;
    window.speechSynthesis.speak(fala);
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

function embaralhar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function criarSilabas() {
    silabasContainer.innerHTML = "";
    const palavra = palavras[palavraAtual];
    const silabasComId = palavra.silabas.map((texto, index) => ({ texto, id: index }));

    let embaralhadas;
    do {
        embaralhadas = embaralhar(silabasComId);
    } while (embaralhadas.length > 1 && embaralhadas.every((item, index) => item.texto === palavra.silabas[index]));

    embaralhadas.forEach(item => {
        const elemento = document.createElement("button");
        elemento.type = "button";
        elemento.classList.add("silaba");
        elemento.textContent = item.texto;
        elemento.dataset.id = item.id;
        elemento.dataset.silaba = item.texto;
        elemento.setAttribute("role", "listitem");
        elemento.setAttribute("aria-label", `Sílaba ${item.texto}`);
        elemento.draggable = true;

        elemento.addEventListener("click", clicarSilaba);
        elemento.addEventListener("dragstart", arrastarInicio);
        elemento.addEventListener("dragend", arrastarFim);

        silabasContainer.appendChild(elemento);
    });
}

function arrastarInicio(evento) {
    const elemento = evento.currentTarget;
    evento.dataTransfer.setData("silabaId", elemento.dataset.id);
    evento.dataTransfer.setData("silabaTexto", elemento.dataset.silaba);
    elemento.classList.add("selecionada");
}

function arrastarFim(evento) {
    evento.currentTarget.classList.remove("selecionada");
}

function clicarSilaba(evento) {
    const elemento = evento.currentTarget;
    if (elemento.classList.contains("usada")) return;

    document.querySelectorAll(".silaba").forEach(silaba => silaba.classList.remove("selecionada"));

    if (silabaSelecionada === elemento) {
        silabaSelecionada = null;
        return;
    }

    silabaSelecionada = elemento;
    elemento.classList.add("selecionada");
    elemento.setAttribute("aria-pressed", "true");
}

vagoes.forEach(vagao => {
    vagao.addEventListener("dragover", evento => {
        evento.preventDefault();
        if (!vagao.classList.contains("preenchido")) vagao.classList.add("destacado");
    });

    vagao.addEventListener("dragleave", () => vagao.classList.remove("destacado"));

    vagao.addEventListener("drop", evento => {
        evento.preventDefault();
        vagao.classList.remove("destacado");
        const id = evento.dataTransfer.getData("silabaId");
        const texto = evento.dataTransfer.getData("silabaTexto");
        verificarSilaba(id, texto, vagao);
    });

    vagao.addEventListener("click", () => {
        if (!silabaSelecionada) return;
        const id = silabaSelecionada.dataset.id;
        const texto = silabaSelecionada.dataset.silaba;
        verificarSilaba(id, texto, vagao);
        silabaSelecionada = null;
    });
});

function verificarSilaba(id, texto, vagao) {
    if (vagao.classList.contains("preenchido")) return;

    const palavra = palavras[palavraAtual];
    const posicao = Number(vagao.dataset.posicao);
    const correta = palavra.silabas[posicao];

    if (texto === correta) {
        somAcerto();
        acertosPartida++;
        vagao.classList.add("preenchido");
        vagao.innerHTML = "";

        const novaSilaba = document.createElement("span");
        novaSilaba.classList.add("silaba");
        novaSilaba.textContent = texto;
        novaSilaba.setAttribute("aria-hidden", "true");
        vagao.appendChild(novaSilaba);

        const original = document.querySelector(`.silaba[data-id="${id}"]`);
        if (original) {
            original.classList.add("usada");
            original.classList.remove("selecionada");
            original.setAttribute("aria-disabled", "true");
        }

        vagao.setAttribute("aria-label", `Vagão preenchido com ${texto}`);
        verificarFinal();
    } else {
        somErro();
        errosPartida++;
        perderVida();
        vagao.classList.add("erro");
        setTimeout(() => vagao.classList.remove("erro"), 400);
    }
}

function perderVida() {
    vidas--;
    atualizarVidas();
    if (vidas <= 0) gameOver();
}

function gameOver() {
    enviarResultadoFinal("Português");
    tituloMensagem.textContent = "Tente novamente!";
    textoMensagem.textContent = "Ah que pena, você ficou sem vidas. Não desista!";
    proximoBtn.textContent = "Tentar novamente";
    mensagem.classList.add("ativa");
    proximoBtn.onclick = reiniciarPalavra;
    proximoBtn.focus();
}

function verificarFinal() {
    const palavra = palavras[palavraAtual];
    const preenchidos = document.querySelectorAll(".vagao.preenchido");
    if (preenchidos.length === palavra.silabas.length) {
        setTimeout(palavraCompleta, 400);
    }
}

function palavraCompleta() {
    somVitoria();
    const ultimaPalavra = palavraAtual >= palavras.length - 1;

    if (ultimaPalavra) {
        enviarResultadoFinal("Português");
        mensagem.classList.remove("ativa");
        modalFim.style.display = "flex";
    } else {
        tituloMensagem.textContent = "Parabéns!";
        textoMensagem.textContent = `Você formou a palavra ${palavras[palavraAtual].palavra}!`;
        proximoBtn.textContent = "Próxima palavra";
        proximoBtn.onclick = proximaPalavra;
        mensagem.classList.add("ativa");
        proximoBtn.focus();
    }
}

function jogarNovamente() {
    modalFim.style.display = "none";
    mensagem.classList.remove("ativa");
    palavraAtual = 0;
    vidas = 3;
    silabaSelecionada = null;
    acertosPartida = 0;
    errosPartida = 0;
    inicioPartida = Date.now();
    partidaFinalizada = false;
    carregarPalavra();
    setTimeout(falarOrientacao, 600);
}

function proximaPalavra() {
    mensagem.classList.remove("ativa");
    palavraAtual++;
    vidas = 3;
    silabaSelecionada = null;
    carregarPalavra();
    setTimeout(falarOrientacao, 600);
}

function reiniciarPalavra() {
    mensagem.classList.remove("ativa");
    vidas = 3;
    silabaSelecionada = null;
    carregarPalavra();
    setTimeout(falarOrientacao, 600);
}

function carregarPalavra() {
    const palavra = palavras[palavraAtual];
    imagemPalavra.src = palavra.imagem;
    imagemPalavra.alt = `Imagem de ${palavra.palavra.toLowerCase()}`;

    vagoes.forEach((vagao, index) => {
        if (index < palavra.silabas.length) {
            vagao.style.display = "flex";
            vagao.innerHTML = "";
            vagao.classList.remove("preenchido", "destacado");
            vagao.setAttribute("aria-label", `${index + 1}º vagão vazio`);
        } else {
            vagao.style.display = "none";
        }
    });

    criarSilabas();
    atualizarVidas();
}

somBtn.addEventListener("click", () => {
    iniciarAudio();
    falarOrientacao();
});

homeBtn.addEventListener("click", () => {
    window.location.href = "/Inicioreal";
});

document.addEventListener("click", () => iniciarMusica(), { once: true });

carregarPalavra();
setTimeout(falarOrientacao, 1000);