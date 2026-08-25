/* Elementos da página */

const imagemPalavra =
    document.getElementById("imagemPalavra");

const palavraElemento =
    document.getElementById("palavra");

const opcoesContainer =
    document.getElementById("opcoes");

const vidasContainer =
    document.getElementById("vidas");

const somBtn =
    document.getElementById("somBtn");

const homeBtn =
    document.getElementById("homeBtn");

const orientacao =
    document.getElementById("orientacao");

const mensagem =
    document.getElementById("mensagem");

const tituloMensagem =
    document.getElementById("tituloMensagem");

const textoMensagem =
    document.getElementById("textoMensagem");

const proximoBtn =
    document.getElementById("proximoBtn");


/* Palavras usadas no jogo */

const palavras = [

    {
        palavra: "GATO",
        incompleta: "_ATO",
        resposta: "G",
        imagem: "img/gato.png",
        opcoes: ["G", "P", "R"]
    },

    {
        palavra: "PATO",
        incompleta: "_ATO",
        resposta: "P",
        imagem: "img/pato.png",
        opcoes: ["B", "P", "M"]
    },

    {
        palavra: "BOLA",
        incompleta: "_OLA",
        resposta: "B",
        imagem: "img/bola.png",
        opcoes: ["B", "C", "D"]
    },

    {
        palavra: "CASA",
        incompleta: "C_SA",
        resposta: "A",
        imagem: "img/casa.png",
        opcoes: ["E", "A", "O"]
    },

    {
        palavra: "MACACO",
        incompleta: "MA_ACO",
        resposta: "C",
        imagem: "img/macaco.png",
        opcoes: ["C", "T", "P"]
    },

    {
        palavra: "BANANA",
        incompleta: "B_NANA",
        resposta: "A",
        imagem: "img/banana.png",
        opcoes: ["E", "I", "A"]
    },

    {
        palavra: "BONECA",
        incompleta: "B_NECA",
        resposta: "O",
        imagem: "img/boneca.png",
        opcoes: ["A", "O", "U"]
    },

    {
        palavra: "CACHORRO",
        incompleta: "C_CHORRO",
        resposta: "A",
        imagem: "img/cachorro.png",
        opcoes: ["E", "A", "I"]
    },

    {
        palavra: "ELEFANTE",
        incompleta: "ELEF_NTE",
        resposta: "A",
        imagem: "img/elefante.png",
        opcoes: ["E", "A", "O"]
    },

    {
        palavra: "MORANGO",
        incompleta: "M_RANGO",
        resposta: "O",
        imagem: "img/morango.png",
        opcoes: ["A", "E", "O"]
    }

];


/* Estado do jogo */

let palavraAtual = 0;
let vidas = 3;
let audioContext = null;
let musicaTocando = false;
let intervaloMusica;


/* Estado da orientação por voz */

let orientacaoFalando = false;


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


                oscilador.type =
                    "sine";


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
                    agora + 0.5
                );


                indice++;


                /* Volta para a primeira nota */

                if (
                    indice >= notas.length
                ) {

                    indice = 0;

                }

            },
            600
        );

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


    const palavra =
        palavras[palavraAtual];


    const texto =
        `Observe a imagem. ` +
        `Complete a palavra ${palavra.incompleta.toLowerCase()}. ` +
        `Escolha a letra correta entre as três opções.`;


    const fala =
        new SpeechSynthesisUtterance(
            texto
        );


    fala.lang =
        "pt-BR";


    /* Define a velocidade da voz */

    fala.rate =
        0.95;


    fala.pitch =
        1.1;


    fala.volume =
        1;


    /* Indica que a orientação começou */

    orientacaoFalando = true;


    /* Indica que a orientação terminou */

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


    /* Para a voz se ela estiver falando */

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


/* Cria as opções de letras */

function criarOpcoes() {

    opcoesContainer.innerHTML = "";


    const palavra =
        palavras[palavraAtual];


    palavra.opcoes.forEach(
        letra => {

            /* Cria o botão da letra */

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.classList.add(
                "letra"
            );


            botao.textContent =
                letra;


            botao.setAttribute(
                "aria-label",
                `Letra ${letra}`
            );


            /* Verifica a letra escolhida */

            botao.addEventListener(
                "click",
                () => {

                    verificarResposta(
                        letra,
                        botao
                    );

                }
            );


            opcoesContainer.appendChild(
                botao
            );

        }
    );

}


/* Verifica se a letra está correta */

function verificarResposta(
    letra,
    botao
) {

    const palavra =
        palavras[palavraAtual];


    const botoes =
        document.querySelectorAll(
            ".letra"
        );


    /* Resposta correta */

    if (
        letra === palavra.resposta
    ) {

        /* Desativa todas as opções */

        botoes.forEach(
            botao => {

                botao.disabled =
                    true;

            }
        );


        somAcerto();


        /* Mostra o efeito de resposta correta */

        botao.classList.add(
            "correta"
        );


        /* Mostra a palavra completa */

        palavraElemento.textContent =
            palavra.palavra;


        /* Mostra a tela de conclusão */

        setTimeout(
            palavraCompleta,
            700
        );


        return;

    }


    /* Resposta incorreta */

    somErro();


    /* Mostra o efeito de erro */

    botao.classList.add(
        "errada"
    );


    /*
       A opção continua disponível.
       Assim, ela pode ser escolhida novamente.
    */


    perderVida();


    /* Remove o efeito de erro */

    if (
        vidas > 0
    ) {

        setTimeout(
            () => {

                botao.classList.remove(
                    "errada"
                );

            },
            500
        );

    }

}


/* Retira uma vida */

function perderVida() {

    vidas--;


    atualizarVidas();


    /* Verifica se o jogador perdeu */

    if (
        vidas <= 0
    ) {

        gameOver();

    }

}


/* Mostra a tela de fim de jogo */

function gameOver() {

    /* Para a orientação por voz */

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

        orientacaoFalando = false;

    }


    tituloMensagem.textContent =
        "Tente novamente!";


    textoMensagem.textContent =
        "Você ficou sem vidas. Não desista!";


    proximoBtn.textContent =
        "Tentar novamente";


    mensagem.classList.add(
        "ativa"
    );


    /* Define a ação do botão */

    proximoBtn.onclick =
        reiniciarPalavra;


    proximoBtn.focus();

}


/* Mostra a conclusão da palavra */

function palavraCompleta() {

    somVitoria();


    tituloMensagem.textContent =
        "Parabéns!";


    textoMensagem.textContent =
        `Você completou a palavra ${palavras[palavraAtual].palavra}!`;


    /* Define o texto do botão */

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


    /* Define a ação do botão */

    proximoBtn.onclick =
        proximaPalavra;


    proximoBtn.focus();

}


/* Vai para a próxima palavra */

function proximaPalavra() {

    mensagem.classList.remove(
        "ativa"
    );


    palavraAtual++;


    /* Volta para a primeira palavra */

    if (
        palavraAtual >=
        palavras.length
    ) {

        palavraAtual = 0;

    }


    /* Recupera as vidas */

    vidas = 3;


    carregarPalavra();

}


/* Reinicia a palavra atual */

function reiniciarPalavra() {

    mensagem.classList.remove(
        "ativa"
    );


    /* Recupera as vidas */

    vidas = 3;


    carregarPalavra();

}


/* Carrega a palavra atual */

function carregarPalavra() {

    const palavra =
        palavras[palavraAtual];


    /* Mostra a imagem da palavra */

    imagemPalavra.src =
        palavra.imagem;


    imagemPalavra.alt =
        `Imagem de ${palavra.palavra.toLowerCase()}`;


    /* Mostra a palavra incompleta */

    palavraElemento.textContent =
        palavra.incompleta;


    /* Atualiza a orientação escrita */

    orientacao.textContent =
        "Escolha a letra que completa a palavra.";


    /* Cria as opções */

    criarOpcoes();


    /* Atualiza as vidas */

    atualizarVidas();

}


/* Botão de orientação */

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

carregarPalavra();


/* Fala a orientação no início */

setTimeout(
    falarOrientacao,
    1000
);