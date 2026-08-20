import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastrobox.css'; 
import Logo from '../imgs/logo.png';
import Responsáveis from '../imgs/Responsáveis.png';
import { Link } from 'react-router-dom';

function Cadastrobox() {
return (
<div className="cadastro-box">
              <div className="logo-container">
                 <img
                src={Logo}
                 alt="Ludiko Logo"
                 className="cadastro-logo"/>
              </div>

        <form className="cadastro-form">
         

          <div className="input-group">
            <input 
              type="text" 
              placeholder="CPF do responsável" 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="number" 
              placeholder="Id do aluno(a)" 
              required 
            />
          </div>

          
          <button type="submit" className="btn-cadastrar">
            Iniciar
          </button>

          <li>Ainda não possui conta? <Link to="/Cadpais">Cadastre-se</Link></li>
        </form>

        <button
            className="btn btn-pais"
            onClick={() => navigate('/Login-Aluno')}
          >
            <img src={Responsáveis} alt="Responsáveis" className="btn-icon"/>
            <span className="btn-text">Responsáveis</span>
          </button>
      </div>

)
}
export default Cadastrobox;