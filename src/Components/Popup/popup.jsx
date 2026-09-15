import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './popuppais.css';

import IconCrianca from "../imgs/Crianca.png";
import IconResponsavel from "../imgs/Responsavel.png";

function Popup({ onClose }) {
  const popupRef = useRef();
  const navigate = useNavigate();

  let nomeCrianca = 'Criança';

  try {
    const nomeSalvo = sessionStorage.getItem('nome_crianca');
    if (nomeSalvo) {
      nomeCrianca = nomeSalvo;
    } else {
      const usuarioSalvo = sessionStorage.getItem('usuario');
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        if (usuario.nome) {
          nomeCrianca = usuario.nome;
        }
      }
    }
  } catch {
    nomeCrianca = 'Criança';
  }

  const closePopup = (e) => {
    if (popupRef.current === e.target && onClose) {
      onClose();
    }
  };

  const handleSair = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/Login-Aluno');
    if (onClose) onClose();
  };

  const handleExcluirConta = () => {
    if (window.confirm('Tem certeza de que deseja excluir a sua conta?')) {
      sessionStorage.clear();
      localStorage.clear();
      alert('Conta excluída.');
      navigate('/');
      if (onClose) onClose();
    }
  };

  return (
    <div className="popup-overlay" ref={popupRef} onClick={closePopup}>
      <div className="popup-modal tema-crianca" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho Lilás com o bonequinho pixel art */}
        <div className="popup-header">
          <div className="header-info">

            <img src={IconCrianca} alt="Criança" className="popup-pixel-icon header-img" />
            <span className="header-text">{nomeCrianca} ✨</span>
>>>>>>> f6b205f533d6cb98788f5dba4dacdb4c3babb0b8
          </div>
          <button className="btn-fechar" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="popup-body">
          <button
            className="menu-item"
            onClick={() => {
              navigate('/Areapais');
              if (onClose) onClose();
            }}
          >
            <div className="item-left">
              <img src={IconResponsavel} alt="Responsável" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Ir para conta do responsável</span>
                <span className="item-subtitle">Painel de controle e relatórios</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <div className="popup-divider" />

          <div className="popup-footer">
            <button className="footer-action-btn sair" onClick={handleSair}>
              <span></span> Sair da conta
            </button>
            <button
              className="footer-action-btn excluir"
              onClick={handleExcluirConta}
            >
              <span></span> Excluir conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;