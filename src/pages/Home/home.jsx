

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
// Certifique-se de que o caminho da logo esteja correto
import logo from '../../Components/imgs/logo.png'; 

function Home() {
  const navigate = useNavigate(); 

  return (
    <div className="home-container">
      {/* Lado Esquerdo - Conteúdo de Login */}
      <div className="left-side">
        <div className="content-box">
          <div className="logo-section">
            <img src={logo} alt="Ludiko Logo" className="logo-img" />
          </div>

          <h2 className="title-action">Entrar como:</h2>

          <div className="buttons-container">
            <button 
              className="btn btn-pais" 
              onClick={() => navigate('/Login-Pais')}
            >
              <span className="btn-icone">👥</span>
              <span className="btn-texto">Responsáveis</span>
            </button>

            <button 
              className="btn btn-filho" 
              onClick={() => navigate('/Login-Aluno')}
            >
              <span className="btn-icone">👧</span>
              <span className="btn-texto">Aluno(a)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lado Direito - Citação sobre a imagem de fundo */}
      <div className="right-side-image-container">
        <div className="quote-container">
          <p className="quote-text">"O começo é a parte mais importante do trabalho."</p>
          <p className="quote-author">— Platão</p>
        </div>
      </div>
    </div> 
  );
}

export default Home;