import React from "react";
import { useNavigate } from "react-router-dom";
import "./popuppais.css";

const Popuppais = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavegar = (caminho) => {
    navigate(caminho);
    if (onClose) onClose();
  };

  const handleSair = () => {
    // Destrói todo o armazenamento de sessão e local
    sessionStorage.clear();
    localStorage.clear();
    navigate("/Login-Pais");
    if (onClose) onClose();
  };

  const handleExcluirConta = () => {
    if (window.confirm("Tem certeza de que deseja excluir a sua conta?")) {
      sessionStorage.clear();
      localStorage.clear();
      alert("Conta excluída.");
      navigate("/");
      if (onClose) onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header-pink">
          <div className="header-info">
            <span className="header-icon">👨‍👩‍👦</span>
            <span className="header-text">Cuide e proteja sua criança! ✨</span>
          </div>
          <button className="btn-fechar" onClick={onClose}>
            ⓧ
          </button>
        </div>

        <div className="popup-body">
          <button
            className="menu-item"
            onClick={() => handleNavegar("/tempo-limite")}
          >
            <div className="item-left">
              <span className="item-icon">⏱️</span>
              <span className="item-title">Tempo-limite de atividades</span>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/mudar-conta-crianca")}
          >
            <div className="item-left">
              <span className="item-icon">🔄</span>
              <span className="item-title">Mudar para conta de criança</span>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/cadastrar-crianca")}
          >
            <div className="item-left">
              <span className="item-icon">➕</span>
              <span className="item-title">Adicionar Criança</span>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/alterar-senha")}
          >
            <div className="item-left">
              <span className="item-icon">🔒</span>
              <span className="item-title">Alterar senha</span>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/historico-uso")}
          >
            <div className="item-left">
              <span className="item-icon">📊</span>
              <div className="item-text-group">
                <span className="item-title">Histórico de Uso</span>
                <span className="item-subtitle">relatórios das semanas anteriores</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/fale-conosco")}
          >
            <div className="item-left">
              <span className="item-icon">💬</span>
              <span className="item-title">Fale conosco</span>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <div className="popup-footer">
            <button className="footer-action-btn sair" onClick={handleSair}>
              ↳ Sair da conta
            </button>
            <button
              className="footer-action-btn excluir"
              onClick={handleExcluirConta}
            >
              🗑️ Excluir conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popuppais;