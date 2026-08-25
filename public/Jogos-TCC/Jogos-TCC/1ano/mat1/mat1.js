/* Elementos da página */

const containerFrutas =
    document.getElementById("container-frutas");

const cesta =
    document.getElementById("cesta");

const frutasNaCesta =
    document.getElementById("frutas-na-cesta");

const btnConfirmar =
    document.getElementById("btnConfirmar");

const vidasContainer =
    document.getElementById("vidas");

const somBtn =
    document.getElementById("somBtn");

const homeBtn =
    document.getElementById("homeBtn");

const orientacaoTexto =
    document.getElementById("orientacaoTexto");

const mensagem =
    document.getElementById("mensagem");

const tituloMensagem =
    document.getElementById("tituloMensagem");

const textoMensagem =
    document.getElementById("textoMensagem");

const proximoBtn =
    document.getElementById("proximoBtn");


/* Frutas usadas no jogo */

const frutasDisponiveis = [
    {
        nome: "maçã",
        plural: "maçãs",
        img: "img/maca.png"
    },

    {
        nome: "banana",
        plural: "bananas",
        img: "img/banana.png"
    },

    {
        nome: "morango",
        plural: "morangos",
        img: "img/morango.png"
    }
];


/* Desafios com a fruta e quantidade */

const desafios = [
    { frutaIndex: 0, quantidadeMeta: 5 },
    { frutaIndex: 1, quantidadeMeta: 3 },
    { frutaIndex: 2, quantidadeMeta: 4 },
    { frutaIndex: 0, quantidadeMeta: 2 },
    { frutaIndex: 1, quantidadeMeta: 6 },
    { frutaIndex: 2, quantidadeMeta: 1 },
    { frutaIndex: 0, quantidadeMeta: 3 }
];


/* Estado do jogo */

let desafioAtual = 0;
let vidas = 3;
let audioContext = null;
let musicaTocando = false;
let intervaloMusica;
let orientacaoFalando = false;
let frutasAdicionadas = 0;


/* Inicia o áudio */

function iniciarAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


/* Toca o som ao colocar uma fruta */

function somColocarFruta() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();


    oscilador.type =
        "sine";


    oscilador.frequency.setValueAtTime(
        400,
        agora
    );


    oscilador.frequency.exponentialRampToValueAtTime(
        800,
        agora + 0.08
    );


    ganho.gain.setValueAtTime(
        0.15,
        agora
    );


    ganho.gain.exponentialRampToValueAtTime(
        0.01,
        agora + 0.08
    );


    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );


    oscilador.start(agora);

    oscilador.stop(
        agora + 0.08
    );

}


/* Toca o som ao retirar uma fruta */

function somTirarFruta() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();


    oscilador.type =
        "sine";


    oscilador.frequency.setValueAtTime(
        600,
        agora
    );


    oscilador.frequency.exponentialRampToValueAtTime(
        300,
        agora + 0.08
    );


    ganho.gain.setValueAtTime(
        0.15,
        agora
    );


    ganho.gain.exponentialRampToValueAtTime(
        0.01,
        agora + 0.08
    );


    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );


    oscilador.start(agora);

    oscilador.stop(
        agora + 0.08
    );

}


/* Toca o som de acerto */

function somAcerto() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();


    oscilador.type =
        "sine";


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


/* Toca o som de erro */

function somErro() {

    iniciarAudio();

    const agora =
        audioContext.currentTime;

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();


    oscilador.type =
        "sawtooth";


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


/* Toca o som de vitória */

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


                    oscilador.type =
                        "sine";


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


                    oscilador.connect(
                        ganho
                    );


                    ganho.connect(
                        audioContext.destination
                    );


                    oscilador.start(
                        agora
                    );


                    oscilador.stop(
                        agora + 0.4
                    );

                },
                indice * 180
            );

        }
    );

}


/* Inicia a música de fundo */

function iniciarMusica() {

    iniciarAudio();


    /* Evita iniciar a música novamente */

    if (musicaTocando) {

        return;

    }


    musicaTocando = true;


    const notas = [
        261.63,
        329.63,
        392.00,
        440.00,
        523.25,
        392.00
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


                oscilador.type =
                    "sine";


                oscilador.frequency.value =
                    notas[indice];


                ganho.gain.setValueAtTime(
                    0.012,
                    agora
                );


                ganho.gain.exponentialRampToValueAtTime(
                    0.001,
                    agora + 0.8
                );


                oscilador.connect(
                    ganho
                );


                ganho.connect(
                    audioContext.destination
                );


                oscilador.start(
                    agora
                );


                oscilador.stop(
                    agora + 0.8
                );


                /* Passa para a próxima nota */

                indice =
                    (indice + 1) % notas.length;

            },
            700
        );

}


/* Cria o texto da orientação */

function obterTextoInstrucao() {

    const desafio =
        desafios[desafioAtual];

    const fruta =
        frutasDisponiveis[desafio.frutaIndex];


    /* Escolhe o nome correto para a quantidade */

    const nomeFruta =
        desafio.quantidadeMeta === 1
            ? fruta.nome
            : fruta.plural;


    return `Coloque ${desafio.quantidadeMeta} ${nomeFruta} na cesta!`;

}


/* Fala a orientação do desafio */

function falarOrientacao() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    /* Para uma orientação anterior */

    window.speechSynthesis.cancel();


    const texto =
        obterTextoInstrucao();


    const fala =
        new SpeechSynthesisUtterance(
            texto
        );


    fala.lang =
        "pt-BR";


    fala.rate =
        0.9;


    fala.pitch =
        1.1;


    orientacaoFalando = true;


    /* Indica que a fala terminou */

    fala.onend =
        () => {

            orientacaoFalando = false;

        };


    /* Indica que ocorreu um erro */

    fala.onerror =
        () => {

            orientacaoFalando = false;

        };


    window.speechSynthesis.speak(
        fala
    );

}


/* Controla a orientação por voz */

function controlarOrientacao() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    /* Para a orientação se ela estiver falando */

    if (
        orientacaoFalando ||
        window.speechSynthesis.speaking
    ) {

        window.speechSynthesis.cancel();

        orientacaoFalando = false;

        return;

    }


    /* Inicia a orientação */

    falarOrientacao();

}


/* Atualiza as vidas na tela */

function atualizarVidas() {

    const imagens =
        vidasContainer.querySelectorAll("img");


    imagens.forEach(
        (imagem, index) => {

            if (
                index < vidas
            ) {

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


/* Carrega o desafio atual */

function carregarDesafio() {

    /* Limpa as frutas anteriores */

    containerFrutas.innerHTML = "";

    frutasNaCesta.innerHTML = "";

    frutasAdicionadas = 0;


    const desafio =
        desafios[desafioAtual];


    const frutaObj =
        frutasDisponiveis[
            desafio.frutaIndex
        ];


    /* Atualiza a orientação escrita */

    const textoInstrucao =
        obterTextoInstrucao();

    orientacaoTexto.textContent =
        textoInstrucao;


    /* Define a quantidade de frutas disponíveis */

    const totalDisponivel =
        Math.max(
            desafio.quantidadeMeta + 3,
            7
        );


    /* Cria as frutas */

    for (
        let i = 0;
        i < totalDisponivel;
        i++
    ) {

        const btnFruta =
            document.createElement(
                "button"
            );


        btnFruta.classList.add(
            "item-fruta"
        );


        btnFruta.setAttribute(
            "aria-label",
            `${frutaObj.nome}. Pressione Enter ou clique para colocar na cesta.`
        );


        /* Adiciona a imagem da fruta */

        const img =
            document.createElement(
                "img"
            );


        img.src =
            frutaObj.img;


        img.alt =
            "";


        img.style.width =
            "100%";


        img.style.height =
            "100%";


        img.style.pointerEvents =
            "none";


        btnFruta.appendChild(
            img
        );


        btnFruta.draggable =
            true;


        /* Permite arrastar a fruta */

        btnFruta.addEventListener(
            "dragstart",
            (e) => {

                e.dataTransfer.setData(
                    "text/plain",
                    "fruta"
                );


                btnFruta.classList.add(
                    "arrastando"
                );

            }
        );


        /* Permite colocar a fruta por clique */

        btnFruta.addEventListener(
            "click",
            () => {

                moverParaCesta(
                    btnFruta,
                    frutaObj.nome
                );

            }
        );


        containerFrutas.appendChild(
            btnFruta
        );

    }


    atualizarVidas();


    /* Fala a orientação */

    setTimeout(
        falarOrientacao,
        600
    );

}


/* Move a fruta para dentro ou fora da cesta */

function moverParaCesta(
    elementoFruta,
    nomeFruta
) {

    /* Retira a fruta da cesta */

    if (
        elementoFruta.parentElement ===
        frutasNaCesta
    ) {

        containerFrutas.appendChild(
            elementoFruta
        );


        frutasAdicionadas--;


        elementoFruta.setAttribute(
            "aria-label",
            `${nomeFruta} fora da cesta. Pressione Enter para colocar na cesta.`
        );


        somTirarFruta();


    } else {

        /* Coloca a fruta na cesta */

        frutasNaCesta.appendChild(
            elementoFruta
        );


        frutasAdicionadas++;


        elementoFruta.setAttribute(
            "aria-label",
            `${nomeFruta} dentro da cesta. Pressione Enter para tirar da cesta.`
        );


        somColocarFruta();

    }

}


/* Permite arrastar a fruta até a cesta */

cesta.addEventListener(
    "dragover",
    (e) => {

        e.preventDefault();

    }
);


cesta.addEventListener(
    "drop",
    (e) => {

        e.preventDefault();


        const frutaArrastada =
            document.querySelector(
                ".arrastando"
            );


        if (
            frutaArrastada &&
            frutaArrastada.parentElement !==
            frutasNaCesta
        ) {

            frutaArrastada.classList.remove(
                "arrastando"
            );


            const desafio =
                desafios[desafioAtual];


            const frutaObj =
                frutasDisponiveis[
                    desafio.frutaIndex
                ];


            moverParaCesta(
                frutaArrastada,
                frutaObj.nome
            );

        }

    }
);


/* Confirma a resposta */

btnConfirmar.addEventListener(
    "click",
    () => {

        const desafio =
            desafios[desafioAtual];


        /* Verifica se a quantidade está correta */

        if (
            frutasAdicionadas ===
            desafio.quantidadeMeta
        ) {

            somAcerto();

            somVitoria();


            tituloMensagem.textContent =
                "Parabéns!";


            textoMensagem.textContent =
                "Você colocou a quantidade exata de frutas!";


            /* Define o texto do botão */

            proximoBtn.textContent =
                desafioAtual <
                desafios.length - 1
                    ? "Próximo Desafio"
                    : "Jogar Novamente";


            mensagem.classList.add(
                "ativa"
            );


            proximoBtn.focus();


            /* Define a próxima ação */

            proximoBtn.onclick =
                proximoDesafio;


        } else {

            /* Resposta incorreta */

            somErro();

            perderVida();

        }

    }
);


/* Retira uma vida */

function perderVida() {

    vidas--;


    atualizarVidas();


    /* Verifica se as vidas acabaram */

    if (
        vidas <= 0
    ) {

        gameOver();

    }

}


/* Mostra a tela de Game Over */

function gameOver() {

    /* Para a orientação por voz */

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }


    tituloMensagem.textContent =
        "Tente Novamente!";


    textoMensagem.textContent =
        "Suas vidas acabaram. Vamos tentar de novo?";


    proximoBtn.textContent =
        "Tentar Novamente";


    mensagem.classList.add(
        "ativa"
    );


    proximoBtn.focus();


    /* Define a ação para reiniciar */

    proximoBtn.onclick =
        reiniciarDesafio;

}


/* Vai para o próximo desafio */

function proximoDesafio() {

    mensagem.classList.remove(
        "ativa"
    );


    desafioAtual =
        (desafioAtual + 1) %
        desafios.length;


    /* Recupera as vidas */

    vidas = 3;


    carregarDesafio();

}


/* Reinicia o desafio atual */

function reiniciarDesafio() {

    mensagem.classList.remove(
        "ativa"
    );


    /* Recupera as vidas */

    vidas = 3;


    carregarDesafio();

}


/* Botão de som */

somBtn.addEventListener(
    "click",
    () => {

        iniciarAudio();

        controlarOrientacao();

    }
);


/* Botão para voltar à tela inicial */

homeBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "../ano1.html";

    }
);


/* Primeiro clique inicia a música */

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

carregarDesafio();