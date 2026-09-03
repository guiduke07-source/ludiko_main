import React from 'react';
import CircularGallery from '../../Components/Bgames/Bgames';
import './Inicio.css';
import Arco from '../../Components/Teste/Teste';
import imagemJogo from '../../Components/imgs/imggames.png'; 

function Inicio({ nomeAluno }) {
    const jogoSilabas = '/Jogos-TCC/Jogos-TCC/1ano/port1/index.html';

    const galeriaUmItems = [
        {
            image: imagemJogo,
            text: 'Trem das Sílabas',
            href: jogoSilabas
        },
        {
            image: imagemJogo,
            text: 'Pescaria da Letra',
            href: '/Jogos-TCC/Jogos-TCC/1ano/port2/index.html'
        },
        {
            image: imagemJogo,
            text: 'Complete a Sequência',
            href: '/Jogos-TCC/Jogos-TCC/1ano/mat2/index.html'
        },
        {
            image: imagemJogo,
            text: 'Reciclagem',
            href: '/Jogos-TCC/Jogos-TCC/1ano/g2/index.html'
        }
    ];

    const galeriaDoisItems = [
        {
            image: imagemJogo,
            text: 'Os 3 porquinhos',
            href: '/Jogos-TCC/Jogos-TCC/1ano/conto1/index.html'
        },
        { 
            image: imagemJogo,
            text: 'Chapeuzinho vermelho', 
            href: '/Jogos-TCC/Jogos-TCC/1ano/conto2/index.html' 
        },
        { 
            image: imagemJogo,
            text: 'A Lebre e a Tartaruga',
            href: '/Jogos-TCC/Jogos-TCC/1ano/conto3/index.html' 
        },
        { 
            image: imagemJogo,
            text: 'Patinho feio',
            href: '/Jogos-TCC/Jogos-TCC/1ano/conto4/index.html' 
        }
    ];

    return (
        <div className='main-content' style={{ display: 'flex', flexDirection: 'column', gap: '80px', width: '100%', paddingBottom: '100px' }}>
            {/* Bloco 1: Arco + Galeria 1 */}
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                <div className='teste' style={{ width: '100%', height: '100%' }}>
                    <Arco variante="verde" />
                </div>
                <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <CircularGallery
                        items={galeriaUmItems}
                        bend={2}
                        textColor="#ffffff"
                        borderRadius={0.2}
                        scrollSpeed={2}
                        scrollEase={0.05}
                    />
                </div>
            </div>

            {/* Bloco 2: Arco + Galeria 2 */}
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                <div className='teste' style={{ width: '100%', height: '100%' }}>
                    <Arco variante="azul" />
                </div>
                <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <CircularGallery
                        items={galeriaDoisItems}
                        bend={2}
                        textColor="#ffffff"
                        borderRadius={0.2}
                        scrollSpeed={2}
                        scrollEase={0.05}
                    />
                </div>
            </div>
        </div>
    );
}

export default Inicio;