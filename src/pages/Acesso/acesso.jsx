import React from 'react';
import { useNavigate } from 'react-router-dom';
import './acesso.css';

import logo from '../../Components/imgs/logo.png';
import fundoInicio from '../../Components/imgs/FundoInicio.png';
import Responsáveis from '../../Components/imgs/Responsáveis.png';
import Aluno from '../../Components/imgs/Aluno.png';


function Acesso() {
  const estiloFundo = { 
      backgroundImage: `url(${fundoInicio})`, // Caminho da imagem importada
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw'
    };
  const navigate = useNavigate();

  return (
    <div className="home-container" style={estiloFundo}>

      {/* LADO ESQUERDO */}
      <div className="left-side">
        <div className="logo-section">
          <img src={logo} alt="Ludiko Logo" className="logo-img" />
        </div>

        <h2 className="title-action">
          Entrar como:
        </h2>

        <div className="button-container">

          <button
            className="btn btn-responsavel"
            onClick={() => navigate('/Areapais')}
          >
<img src={Responsáveis} alt="Responsáveis" className="btn-icon"/>
            <span className="btn-text">Responsáveis</span>
          </button>

          <button
  className="btn btn-filho"
  onClick={() => navigate('/Login-Aluno')}
>
  <img src={Aluno} alt="Aluno(a)" className="btn-icon" />
  <span className="btn-text">Aluno(a)</span>
</button>

        </div>
      </div>

      

    </div>
  );
}

export default Acesso;