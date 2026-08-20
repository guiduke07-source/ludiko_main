import React from 'react';
import './headerpais.css';
import logoApp from '../imgs/logo.png';

export default function Headerpais({ onMenuClick }) {
  let nomeResponsavel = 'Responsável';

  try {
    const usuarioSalvo = localStorage.getItem('usuario');

    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      nomeResponsavel = usuario.nome || 'Responsável';
    }
  } catch {
    nomeResponsavel = 'Responsável';
  }

  return (
    <header className="custom-headerpais-wrapper">
      <div className="custom-headerpais-left-badge">
        <div className="image-icon">
          <img
            src={logoApp}
            alt="Logo do App"
            className="custom-header-logo"
          />
        </div>
      </div>

      <div className="custom-headerpais-bar">
        <h1 className="custom-headerpais-title">
          Olá, {nomeResponsavel}
        </h1>

        <button
          className="custom-headerpais-menu-btn"
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