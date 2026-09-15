import React from "react";
import { useNavigate } from "react-router-dom";
import "./popuppais.css";

// Imagens Pixel Art dos Menus
import IconResponsavel from "../imgs/Responsavel.png";
import IconTempo from "../imgs/Tempo.png";
import IconMudanca from "../imgs/Mudanca.png";
import IconAdicao from "../imgs/Adicao.png";
import IconCadeado from "../imgs/Cadeado.png";
import IconGrafico from "../imgs/Grafico.png";
import IconContato from "../imgs/Contato.png";

const Popuppais = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavegar = (caminho) => {
    navigate(caminho);
    if (onClose) onClose();
  };

  const handleSair = () => {
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
      <div className="popup-modal tema-pais" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="popup-header">
          <div className="header-info">
            <img src={IconResponsavel} alt="Responsável" className="popup-pixel-icon header-img" />
            <span className="header-text">Cuide e proteja sua criança! ✨</span>
          </div>
          <button className="btn-fechar" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Corpo com imagens nos botões */}
        <div className="popup-body">
          <button
            className="menu-item"
            onClick={() => handleNavegar("/tempo-limite")}
          >
            <div className="item-left">
              <img src={IconTempo} alt="Tempo" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Tempo-limite de atividades</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/mudar-conta-crianca")}
          >
            <div className="item-left">
              <img src={IconMudanca} alt="Mudar conta" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Mudar para conta de criança</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/cadastrar-crianca")}
          >
            <div className="item-left">
              <img src={IconAdicao} alt="Adicionar" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Adicionar Criança</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/alterar-senha")}
          >
            <div className="item-left">
              <img src={IconCadeado} alt="Senha" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Alterar senha</span>
              </div>
            </div>
            <span className="item-arrow">›</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavegar("/historico-uso")}
          >
            <div className="item-left">
              <img src={IconGrafico} alt="Histórico" className="popup-pixel-icon" />
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
              <img src={IconContato} alt="Contato" className="popup-pixel-icon" />
              <div className="item-text-group">
                <span className="item-title">Fale conosco</span>
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
};

export default Popuppais;