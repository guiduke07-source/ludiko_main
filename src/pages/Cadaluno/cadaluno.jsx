import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadaluno.css';

import Logo from '../../Components/imgs/logo.png';
import Roxocad from '../../Components/Roxocad/roxocad';
import { cadastrarCrianca } from '../../services/criancaApi';

function Cadaluno() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const dados = await cadastrarCrianca({
        nome,
        cpf,
        senha,
        data_nascimento: dataNascimento,
      });

      const usuario = JSON.parse(
        localStorage.getItem('usuario') || '{}'
      );

      usuario.criancas_ids = [
        ...(usuario.criancas_ids || []),
        dados.crianca.id,
      ];

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );

      navigate('/Areapais');
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
                placeholder="Nome da criança"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="CPF da criança"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Crie uma senha para a criança"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) =>
                  setDataNascimento(e.target.value)
                }
                required
              />
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <button
              type="submit"
              className="btn-cadastrar"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar criança'}
            </button>
          </form>
        </div>
      </div>

      <div className="right-cadastro-side">
        <Roxocad />
      </div>
    </div>
  );
}

export default Cadaluno;