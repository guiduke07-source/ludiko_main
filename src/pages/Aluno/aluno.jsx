import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login-A.css';
import Roxologin from '../../Components/Roxologin/roxolog';
import Logo from '../../Components/imgs/logo.png';
import IconResponsavel from '../../Components/imgs/Responsavel.png';
import { fazerLoginAluno } from '../../services/authApi';

function Logina() {
  const navigate = useNavigate();

  const [cpfAluno, setCpfAluno] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const dados = await fazerLoginAluno(cpfAluno, senha);

      sessionStorage.clear();
      localStorage.clear();

      sessionStorage.setItem('token', dados.token);
      sessionStorage.setItem('usuario', JSON.stringify(dados.usuario));
      sessionStorage.setItem('nome_crianca', dados.usuario.nome);
      sessionStorage.setItem('crianca_ativa_id', dados.usuario.id);
      sessionStorage.setItem('tipo', 'crianca');

      navigate('/Inicioreal');
    } catch (erroApi) {
      setErro(erroApi.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-container">
      <div className="left-login-side">
        <Roxologin />
      </div>

      <div className="right-login-side">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="back-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div className="cadastro-box">
          <div className="logo-container">
            <img
              src={Logo}
              alt="Ludiko Logo"
              className="cadastro-logo"
            />
          </div>

          <form className="cadastro-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="CPF do aluno"
                value={cpfAluno}
                onChange={(e) => setCpfAluno(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <button
              type="button"
              className="alterar-senha-link-btn"
              onClick={() => navigate('/alterar-senha')}
            >
              Esqueceu ou quer alterar a senha
            </button>

            <button
              type="submit"
              className="btn-cadastro"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Iniciar'}
            </button>

            <p className="cadastro-redirect">
              O responsável ainda não fez seu cadastro?{' '}
              <Link to="/Cadpais">Cadastre o responsável</Link>
            </p>
          </form>

          <button
            className="btn-pai"
            onClick={() => navigate('/Login-Pais')}
          >
            <span className="btn-icon">
              <img
                src={IconResponsavel}
                alt="Responsável"
                style={{ width: '32px', height: '32px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </span>
            <span className="btn-text">Responsável</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logina;