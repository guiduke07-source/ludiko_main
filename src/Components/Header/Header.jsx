import React from 'react';
import './header.css'; 

// IMPORTAÇÃO DA LOGO
// Importamos o arquivo para que o React gere o caminho correto após o build
import logoApp from '../imgs/logo.png'; 

/**
 * Componente Header atualizado com Logo
 * @param {Object} props
 * @param {Function} props.onMenuClick - Função que abre o Popup ao clicar no botão de 3 pontinhos.
 */
export default function Header({ onMenuClick }) {
  return (
    <header className="custom-header-wrapper">
      {/* Lado Esquerdo: Badge redondo com a sua LOGO e o pontinho */}
      <div className="custom-header-left-badge">
        <div className="image-icon">
          {/* Tag de imagem alterada para usar a variável importada (sem aspas) */}
          <img 
            src={logoApp} 
            alt="Logo do App" 
            className="custom-header-logo" 
          />
        </div>
      </div>

      {/* Barra Central/Direita Arredondada */}
      <div className="custom-header-bar">
        <h1 className="custom-header-title">Olá, Maria</h1>
        
        {/* Botão de 3 pontinhos na outra extremidade */}
        <button 
          className="custom-header-menu-btn" 
          onClick={onMenuClick}
          title="Opções da conta"
          aria-label="Abrir menu de opções"
        >
          ⋮
        </button>
      </div>
    </header>
  );
}