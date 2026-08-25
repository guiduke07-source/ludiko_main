/* Elementos da página */

const imagemPalavra =
    document.getElementById("imagemPalavra");

const silabasContainer =
    document.getElementById("silabas");

const vagoes =
    document.querySelectorAll(".vagao");

const vidasContainer =
    document.getElementById("vidas");

const somBtn =
    document.getElementById("somBtn");

const homeBtn =
    document.getElementById("homeBtn");

const mensagem =
    document.getElementById("mensagem");

const tituloMensagem =
    document.getElementById("tituloMensagem");

const textoMensagem =
    document.getElementById("textoMensagem");

const proximoBtn =
    document.getElementById("proximoBtn");


/* Palavras do jogo */

const palavras = [

    {
        palavra: "BONECA",
        imagem: "img/boneca.png",
        silabas: ["BO", "NE", "CA"]
    },

    {
        palavra: "BANANA",
        imagem: "img/banana.png",
        silabas: ["BA", "NA", "NA"]
    },

    {
        palavra: "MACACO",
        imagem: "img/macaco.png",
        silabas: ["MA", "CA", "CO"]
    },

    {
        palavra: "MORANGO",
        imagem: "img/morango.png",
        silabas: ["MO", "RAN", "GO"]
    },

    {
        palavra: "CACHORRO",
        imagem: "img/cachorro.png",
        silabas: ["CA", "CHO", "RRO"]
    },

    {
        palavra: "VASSOURA",
        imagem: "img/vaga.png",
        silabas: ["VA", "SSOU", "RA"]
    }

];


/* Estado do jogo */

let palavraAtual = 0;

let vidas = 3;

let silabaSelecionada = null;

let audioContext = null;

let musicaTocando = false;

let intervaloMusica;


/* Inicia o sistema de áudio */

function iniciarAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


/* Som de acerto */

function somAcerto() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();

    oscilador.type = "sine";

    oscilador.frequency.setValueAtTime(
        600,
        agora
    );

    oscilador.frequency.exponentialRampToValueAtTime(
        900,
        agora + 0.15
    );

    ganho.gain.setValueAtTime(
        0.2,
        agora
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.01,
        agora + 0.3
    );

    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );

    oscilador.start(agora);

    oscilador.stop(
        agora + 0.3
    );
}


/* Som de erro */

function somErro() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();

    oscilador.type = "sawtooth";

    oscilador.frequency.setValueAtTime(
        180,
        agora
    );

    oscilador.frequency.exponentialRampToValueAtTime(
        100,
        agora + 0.25
    );

    ganho.gain.setValueAtTime(
        0.15,
        agora
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.01,
        agora + 0.3
    );

    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );

    oscilador.start(agora);

    oscilador.stop(
        agora + 0.3
    );
}


/* Som de vitória */

function somVitoria() {

    iniciarAudio();

    const notas = [
        523,
        659,
        784,
        1046
    ];

    notas.forEach(
        (nota, indice) => {

            setTimeout(
                () => {

                    const agora =
                        audioContext.currentTime;

                    const oscilador =
                        audioContext.createOscillator();

                    const ganho =
                        audioContext.createGain();

                    oscilador.type = "sine";

                    oscilador.frequency.value =
                        nota;

                    ganho.gain.setValueAtTime(
                        0.2,
                        agora
                    );

                    ganho.gain.exponentialRampToValueAtTime(
                        0.01,
                        agora + 0.4
                    );

                    oscilador.connect(ganho);

                    ganho.connect(
                        audioContext.destination
                    );

                    oscilador.start(agora);

                    oscilador.stop(
                        agora + 0.4
                    );

                },
                indice * 180
            );

        }
    );
}


/* Música de fundo */

function iniciarMusica() {

    iniciarAudio();

    if (musicaTocando) {
        return;
    }

    musicaTocando = true;

    const notas = [
        261,
        329,
        392,
        329,
        293,
        349,
        440,
        349
    ];

    let indice = 0;

    intervaloMusica =
        setInterval(
            () => {

                const agora =
                    audioContext.currentTime;

                const oscilador =
                    audioContext.createOscillator();

                const ganho =
                    audioContext.createGain();

                oscilador.type = "sine";

                oscilador.frequency.value =
                    notas[indice];

                ganho.gain.setValueAtTime(
                    0.018,
                    agora
                );

                ganho.gain.exponentialRampToValueAtTime(
                    0.001,
                    agora + 0.5
                );

                oscilador.connect(ganho);

                ganho.connect(
                    audioContext.destination
                );

                oscilador.start(agora);

                oscilador.stop(
                    agora + 0.5
                );

                indice++;

                if (
                    indice >= notas.length
                ) {
                    indice = 0;
                }

            },
            600
        );
}


/* Orientação falada */

function falarOrientacao() {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const palavra =
        palavras[palavraAtual];

    const texto =
        `Observe a imagem. ` +
        `A palavra é ${palavra.palavra.toLowerCase()}. ` +
        `Escolha as sílabas e coloque nos vagões na ordem correta.`;

    const fala =
        new SpeechSynthesisUtterance(
            texto
        );

    fala.lang = "pt-BR";

    fala.rate = 0.8;

    fala.pitch = 1.1;

    fala.volume = 1;

    window.speechSynthesis.speak(
        fala
    );
}


/* Atualiza as vidas */

function atualizarVidas() {

    const imagens =
        vidasContainer.querySelectorAll("img");

    imagens.forEach(
        (imagem, index) => {

            if (index < vidas) {

                imagem.classList.remove(
                    "perdida"
                );

            } else {

                imagem.classList.add(
                    "perdida"
                );

            }

        }
    );


    vidasContainer.setAttribute(
        "aria-label",
        `${vidas} ${vidas === 1 ? "vida" : "vidas"} restantes`
    );
}


/* Embaralha uma lista */

function embaralhar(array) {

    const copia = [...array];

    for (
        let i = copia.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copia[i],
            copia[j]
        ] = [
            copia[j],
            copia[i]
        ];

    }

    return copia;
}


/* Cria as sílabas */

function criarSilabas() {

    silabasContainer.innerHTML = "";

    const palavra =
        palavras[palavraAtual];

    const silabasComId =
        palavra.silabas.map(
            (texto, index) => {

                return {
                    texto,
                    id: index
                };

            }
        );


    let embaralhadas;


    do {

        embaralhadas =
            embaralhar(
                silabasComId
            );

    } while (
        embaralhadas.length > 1 &&
        embaralhadas.every(
            (item, index) =>
                item.texto ===
                palavra.silabas[index]
        )
    );


    embaralhadas.forEach(
        item => {

            const elemento =
                document.createElement("button");

            elemento.type = "button";

            elemento.classList.add(
                "silaba"
            );

            elemento.textContent =
                item.texto;

            elemento.dataset.id =
                item.id;

            elemento.dataset.silaba =
                item.texto;

            elemento.setAttribute(
                "role",
                "listitem"
            );

            elemento.setAttribute(
                "aria-label",
                `Sí­laba ${item.texto}`
            );

            elemento.draggable = true;


            /* Seleção da sílaba */

            elemento.addEventListener(
                "click",
                clicarSilaba
            );


            /* Início do arraste */

            elemento.addEventListener(
                "dragstart",
                arrastarInicio
            );


            /* Fim do arraste */

            elemento.addEventListener(
                "dragend",
                arrastarFim
            );


            silabasContainer.appendChild(
                elemento
            );

        }
    );
}


/* Inicia o arraste */

function arrastarInicio(evento) {

    const elemento =
        evento.currentTarget;

    evento.dataTransfer.setData(
        "silabaId",
        elemento.dataset.id
    );

    evento.dataTransfer.setData(
        "silabaTexto",
        elemento.dataset.silaba
    );

    elemento.classList.add(
        "selecionada"
    );
}


/* Finaliza o arraste */

function arrastarFim(evento) {

    evento.currentTarget.classList.remove(
        "selecionada"
    );
}


/* Seleciona uma sílaba */

function clicarSilaba(evento) {

    const elemento =
        evento.currentTarget;

    if (
        elemento.classList.contains(
            "usada"
        )
    ) {
        return;
    }


    document
        .querySelectorAll(".silaba")
        .forEach(
            silaba => {

                silaba.classList.remove(
                    "selecionada"
                );

            }
        );


    if (
        silabaSelecionada === elemento
    ) {

        silabaSelecionada = null;

        return;

    }


    silabaSelecionada =
        elemento;

    elemento.classList.add(
        "selecionada"
    );


    /* Indica a seleção */

    elemento.setAttribute(
        "aria-pressed",
        "true"
    );
}


/* Configura os vagões */

vagoes.forEach(
    vagao => {

        /* Permite arrastar para o vagão */

        vagao.addEventListener(
            "dragover",
            evento => {

                evento.preventDefault();

                if (
                    !vagao.classList.contains(
                        "preenchido"
                    )
                ) {

                    vagao.classList.add(
                        "destacado"
                    );

                }

            }
        );


        /* Remove o destaque */

        vagao.addEventListener(
            "dragleave",
            () => {

                vagao.classList.remove(
                    "destacado"
                );

            }
        );


        /* Coloca a sílaba no vagão */

        vagao.addEventListener(
            "drop",
            evento => {

                evento.preventDefault();

                vagao.classList.remove(
                    "destacado"
                );

                const id =
                    evento.dataTransfer.getData(
                        "silabaId"
                    );

                const texto =
                    evento.dataTransfer.getData(
                        "silabaTexto"
                    );

                verificarSilaba(
                    id,
                    texto,
                    vagao
                );

            }
        );


        /* Permite usar o teclado */

        vagao.addEventListener(
            "click",
            () => {

                if (
                    !silabaSelecionada
                ) {
                    return;
                }

                const id =
                    silabaSelecionada.dataset.id;

                const texto =
                    silabaSelecionada.dataset.silaba;

                verificarSilaba(
                    id,
                    texto,
                    vagao
                );

                silabaSelecionada =
                    null;

            }
        );

    }
);


/* Verifica a sílaba */

function verificarSilaba(
    id,
    texto,
    vagao
) {

    if (
        vagao.classList.contains(
            "preenchido"
        )
    ) {
        return;
    }


    const palavra =
        palavras[palavraAtual];

    const posicao =
        Number(
            vagao.dataset.posicao
        );

    const correta =
        palavra.silabas[posicao];


    if (
        texto === correta
    ) {

        /* Sílaba correta */

        somAcerto();

        vagao.classList.add(
            "preenchido"
        );

        vagao.innerHTML = "";


        const novaSilaba =
            document.createElement("span");

        novaSilaba.classList.add(
            "silaba"
        );

        novaSilaba.textContent =
            texto;

        novaSilaba.setAttribute(
            "aria-hidden",
            "true"
        );

        vagao.appendChild(
            novaSilaba
        );


        const original =
            document.querySelector(
                `.silaba[data-id="${id}"]`
            );


        if (original) {

            original.classList.add(
                "usada"
            );

            original.classList.remove(
                "selecionada"
            );

            original.setAttribute(
                "aria-disabled",
                "true"
            );

        }


        vagao.setAttribute(
            "aria-label",
            `Vagão preenchido com ${texto}`
        );


        verificarFinal();

    } else {

        /* Sílaba incorreta */

        somErro();

        perderVida();

        vagao.classList.add(
            "erro"
        );

        setTimeout(
            () => {

                vagao.classList.remove(
                    "erro"
                );

            },
            400
        );

    }
}


/* Remove uma vida */

function perderVida() {

    vidas--;

    atualizarVidas();


    if (vidas <= 0) {

        gameOver();

    }
}


/* Mostra a tela de fim */

function gameOver() {

    tituloMensagem.textContent =
        "Tente novamente!";

    textoMensagem.textContent =
        "Ah que pena, você ficou sem vidas. Não desista!";

    proximoBtn.textContent =
        "Tentar novamente";

    mensagem.classList.add(
        "ativa"
    );

    proximoBtn.onclick =
        reiniciarPalavra;

    proximoBtn.focus();
}


/* Verifica se a palavra foi formada */

function verificarFinal() {

    const palavra =
        palavras[palavraAtual];

    const preenchidos =
        document.querySelectorAll(
            ".vagao.preenchido"
        );


    if (
        preenchidos.length ===
        palavra.silabas.length
    ) {

        setTimeout(
            palavraCompleta,
            400
        );

    }
}


/* Mostra a conclusão */

function palavraCompleta() {

    somVitoria();


    tituloMensagem.textContent =
        "Parabéns!!";


    textoMensagem.textContent =
        `Você formou a palavra ${palavras[palavraAtual].palavra}!`;


    if (
        palavraAtual >=
        palavras.length - 1
    ) {

        proximoBtn.textContent =
            "Jogar novamente";

    } else {

        proximoBtn.textContent =
            "Próxima palavra";

    }


    mensagem.classList.add(
        "ativa"
    );


    proximoBtn.onclick =
        proximaPalavra;

    proximoBtn.focus();
}


/* Passa para a próxima palavra */

function proximaPalavra() {

    mensagem.classList.remove(
        "ativa"
    );

    palavraAtual++;

    if (
        palavraAtual >=
        palavras.length
    ) {

        palavraAtual = 0;

    }

    vidas = 3;

    silabaSelecionada = null;

    carregarPalavra();

    setTimeout(
        falarOrientacao,
        600
    );
}


/* Reinicia a palavra */

function reiniciarPalavra() {

    mensagem.classList.remove(
        "ativa"
    );

    vidas = 3;

    silabaSelecionada = null;

    carregarPalavra();

    setTimeout(
        falarOrientacao,
        600
    );
}


/* Carrega a palavra atual */

function carregarPalavra() {

    const palavra =
        palavras[palavraAtual];


    imagemPalavra.src =
        palavra.imagem;

    imagemPalavra.alt =
        `Imagem de ${palavra.palavra.toLowerCase()}`;


    /* Atualiza os vagões */

    vagoes.forEach(
        (vagao, index) => {

            if (
                index <
                palavra.silabas.length
            ) {

                vagao.style.display =
                    "flex";

                vagao.innerHTML = "";

                vagao.classList.remove(
                    "preenchido"
                );

                vagao.classList.remove(
                    "destacado"
                );

                vagao.setAttribute(
                    "aria-label",
                    `${index + 1}º vagão vazio`
                );

            } else {

                vagao.style.display =
                    "none";

            }

        }
    );


    criarSilabas();

    atualizarVidas();
}


/* Botão de som */

somBtn.addEventListener(
    "click",
    () => {

        iniciarAudio();

        falarOrientacao();

    }
);


/* Botão de início */

homeBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "../ano1.html";

    }
);


/* Inicia a música após a primeira interação */

document.addEventListener(
    "click",
    () => {

        iniciarMusica();

    },
    {
        once: true
    }
);


/* Inicia o jogo */

carregarPalavra();

setTimeout(
    falarOrientacao,
    1000
);