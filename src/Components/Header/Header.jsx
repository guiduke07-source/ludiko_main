import React from 'react';
import './header.css';
import logoApp from '../imgs/logo.png';

export default function Header({ onMenuClick, nomeAluno }) {
  let nomeExibido = '';

  if (nomeAluno && nomeAluno !== 'Aluno') {
    nomeExibido = nomeAluno;
  }

  if (!nomeExibido) {
    const tipo = sessionStorage.getItem('tipo');

    if (tipo === 'crianca') {
      nomeExibido = sessionStorage.getItem('nome_crianca');
    } else if (tipo === 'responsavel') {
      nomeExibido = sessionStorage.getItem('nome_responsavel');
    }

    if (!nomeExibido) {
      try {
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
        nomeExibido = usuario.nome || '';
      } catch {
        nomeExibido = '';
      }
    }
  }

  if (!nomeExibido) {
    nomeExibido = 'Visitante';
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
          Olá, {nomeExibido}
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