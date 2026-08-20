import React from 'react';
import CircularGallery from '../../Components/Bgames/Bgames';
import './Inicio.css';
import Arco from '../../Components/Teste/Teste';

// IMPORTAÇÃO DA IMAGEM (Opção 1)
// O empacotador agora reconhece esta variável como o caminho correto do arquivo
import imagemJogo from '../../Components/imgs/imggames.png'; 

function Inicio() {
    // Passamos a variável 'imagemJogo' diretamente para a propriedade 'image' (sem aspas)
    const galeriaUmItems = [
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' }
    ];

    const galeriaDoisItems = [
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' },
        { image: imagemJogo, text: 'Jogo', href: '' }
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