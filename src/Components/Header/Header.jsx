import React from 'react';
import './header.css';
import logoApp from '../imgs/logo.png';

export default function Header({ onMenuClick }) {
  let nomeCrianca = 'Criança';

  try {
    const usuarioSalvo = localStorage.getItem('usuario');

    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.tipo === 'crianca') {
        nomeCrianca = usuario.nome || 'Criança';
      }
    }
  } catch {
    nomeCrianca = 'Criança';
  }

  return (
    <header className="custom-header-wrapper">
      <div className="custom-header-left-badge">
        <div className="image-icon">
          <img
            src={logoApp}
            alt="Logo do App"
            className="custom-header-logo"
          />
        </div>
      </div>

      <div className="custom-header-bar">
        <h1 className="custom-header-title">
          Olá, {nomeCrianca}
        </h1>

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