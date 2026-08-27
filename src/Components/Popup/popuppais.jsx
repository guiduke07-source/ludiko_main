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
    localStorage.clear();
    navigate("/Inicio");
    if (onClose) onClose();
  };

  const handleExcluirConta = () => {
    if (window.confirm("Tem certeza de que deseja excluir a sua conta?")) {
      alert("Conta excluída.");
      navigate("/");
      if (onClose) onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho Rosa */}
        <div className="popup-header-pink">
          <div className="header-info">
            <span className="header-icon">👨‍👩‍👦</span>
            <span className="header-text">Cuide e proteja sua criança! ✨</span>
          </div>
          <button className="btn-fechar" onClick={onClose}>
            ⓧ
          </button>
        </div>

        {/* Lista de Opções */}
        <div className="popup-body">
          {/* Tempo limite de atividades */}
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

          {/* Mudar para conta de criança */}
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

          {/* Alterar senha */}
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

          {/* Fale conosco */}
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

          {/* Botões do Rodapé */}
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