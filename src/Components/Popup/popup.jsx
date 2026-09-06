import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './popuppais.css';

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
        {/* Cabeçalho Lilás */}
        <div className="popup-header">
          <div className="header-info">
            <span className="header-icon">🧒</span>
            <span className="header-text">{nomeCrianca} ✨</span>
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
              <span className="item-icon">👨‍👩‍👦</span>
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
              <span>↳</span> Sair da conta
            </button>
            <button
              className="footer-action-btn excluir"
              onClick={handleExcluirConta}
            >
              <span>🗑️</span> Excluir conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;