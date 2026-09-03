import React, { useState, useEffect } from 'react';
import './headerpais.css';
import logoApp from '../imgs/logo.png';

export default function Headerpais({ onMenuClick, nomeResponsavel }) {
  const [nomeExibido, setNomeExibido] = useState(nomeResponsavel || 'Responsável');

  useEffect(() => {
    // 1. Se foi passado por prop válido, usa imediatamente
    if (nomeResponsavel && nomeResponsavel !== 'Responsável') {
      setNomeExibido(nomeResponsavel);
      return;
    }

    // 2. Busca na chave dedicada do responsável no sessionStorage
    const nomeSalvo = sessionStorage.getItem('nome_responsavel');
    if (nomeSalvo) {
      setNomeExibido(nomeSalvo);
      return;
    }

    // 3. Fallback procurando no objeto do usuário na sessão
    try {
      const usuarioSalvo = sessionStorage.getItem('usuario');
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        if (usuario.nome) {
          setNomeExibido(usuario.nome);
          return;
        }
      }
    } catch {
      setNomeExibido('Responsável');
    }
  }, [nomeResponsavel]);

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
          Olá, {nomeExibido}
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