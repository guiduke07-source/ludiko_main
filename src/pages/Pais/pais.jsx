import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pais.css';
import Logo from '../../Components/imgs/logo.png';
import Azullogin from '../../Components/Azullogin/azullog';
import { fazerLogin } from '../../services/authApi';

function Loginp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const dados = await fazerLogin(email, senha);

      sessionStorage.clear();
      localStorage.clear();

      sessionStorage.setItem('token', dados.token);
      sessionStorage.setItem('usuario', JSON.stringify(dados.usuario));
      sessionStorage.setItem('nome_responsavel', dados.usuario.nome);
      sessionStorage.setItem('tipo', 'responsavel');

      navigate('/Acesso');
    } catch (erroApi) {
      setErro(erroApi.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-container">
      <div className="left-login-side">
        <Azullogin />
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
                type="email"
                placeholder="E-mail do responsável"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              🔒 Esqueceu ou quer alterar a senha
            </button>

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Iniciar'}
            </button>

            <p className="cadastro-redirect">
              Ainda não possui conta?{' '}
              <Link to="/Cadpais">Cadastre-se</Link>
            </p>
          </form>

          <button
            className="btn btn-aluno"
            onClick={() => navigate('/Login-Aluno')}
          >
            <span className="btn-icon">👧</span>
            <span className="btn-text">Aluno(a)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loginp;