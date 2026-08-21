import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadpais.css';
import AzulCad from '../../Components/Azulcad/azulcad';
import Logo from '../../Components/imgs/logo.png';
import { cadastrarResponsavel } from '../../services/authApi';

function Cadpais() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');

    if (pin.length !== 4) {
      setErro('O PIN deve ter 4 números.');
      return;
    }

    setCarregando(true);

    try {
      const dados = await cadastrarResponsavel({
        nome,
        email,
        cpf,
        senha,
        pin,
      });

      localStorage.setItem('token', dados.token);
      localStorage.setItem(
        'usuario',
        JSON.stringify(dados.usuario)
      );

      navigate('/Cadaluno');
    } catch (erroApi) {
      setErro(erroApi.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-container">
      <div className="left-cadastro-side">
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

          <form className="cadastro-form" onSubmit={handleCadastro}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome do responsável"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="CPF do responsável"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
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

            <div className="input-group">
              <input
                type="password"
                inputMode="numeric"
                maxLength="4"
                placeholder="Crie um PIN de 4 números"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ''))
                }
                required
              />
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <button
              type="submit"
              className="btn-cadpais"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>

      <div className="right-cadastro-side">
        <AzulCad />
      </div>
    </div>
  );
}

export default Cadpais;