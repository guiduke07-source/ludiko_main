import React from 'react';
import { useNavigate } from 'react-router-dom';
import './acesso.css';

import logo from '../../Components/imgs/logo.png';
import fundoInicio from '../../Components/imgs/FundoInicio.png';
import Responsavel from '../../Components/imgs/Responsavel.png';
import Crianca from '../../Components/imgs/Crianca.png';

function Acesso() {
  const navigate = useNavigate();

  const estiloFundo = {
    backgroundImage: `url(${fundoInicio})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw',
  };

  return (
    <div className="home-container" style={estiloFundo}>
      <div className="left-side">
        <div className="logo-section">
          <img src={logo} alt="Ludiko Logo" className="logo-img" />
        </div>

        <h2 className="title-action">Entrar como:</h2>

        <div className="button-container">
          <button
            className="btn btn-responsavel"
            onClick={() => navigate('/Areapais')}
          >
            <img
              src={Responsavel}
              alt="Responsável"
              className="personagem"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
            <span className="btn-text">Responsáveis</span>
          </button>

          <button
            className="btn btn-filho"
            onClick={() => navigate('/Login-Aluno')}
          >
            <img
              src={Crianca}
              alt="Aluno(a)"
              className="personagem"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
            <span className="btn-text">Aluno(a)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Acesso;