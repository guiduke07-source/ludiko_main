import React, { useState } from 'react';
import Header from '../../Components/Header/header';
import Popup from '../../Components/Popup/popup';
import Inicio from '../Inicio/inicio';

function Inicioreal() {
    // Estado que controla se o popup de configurações/sair está visível
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'transparent' }}>
            
            {/* 
              Passamos a função para abrir o popup via prop (onMenuClick).
              Assim, o botão dentro do seu Header conseguirá alterar o estado aqui do pai.
            */}
            <div className='headercenter'
            style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%',
                    padding: '0 20px', /* Margem de segurança nas laterais */
                    boxSizing: 'border-box'
                }}>
            <Header onMenuClick={() => setShowPopup(true)} />
            </div>
            {/* O Popup só aparece quando showPopup for true */}
            {showPopup && <Popup onClose={() => setShowPopup(false)} />}

            {/* A sua página com as galerias entra aqui embaixo, sem sofrer interferência */}
            <main style={{ width: '100%', marginTop: '20px' }}>
                <Inicio />
            </main>

        </div>
    );
}

export default Inicioreal;