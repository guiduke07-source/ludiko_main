import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './areapais.css';

import fundoInicio from '../../Components/imgs/FundoInicio.png';
import Responsaveis from '../../Components/imgs/Responsáveis.png';

function Areapais() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro('');

    if (pin.length !== 4) {
      setErro('Digite um PIN de 4 números.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setErro('Faça login novamente.');
      navigate('/Login-Pais');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        'http://127.0.0.1:5000/api/auth/verificar-pin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pin }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Não foi possível validar o PIN.');
      }

      if (dados.token) {
        localStorage.setItem('token', dados.token);
      }

      if (dados.usuario) {
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        localStorage.setItem('nome_usuario', dados.usuario.nome);
        localStorage.setItem('nome_responsavel', dados.usuario.nome);
        localStorage.setItem('tipo', 'responsavel');
      }

      navigate('/Configpais');
    } catch (erroApi) {
      setErro(erroApi.message);
      setPin('');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${fundoInicio})` }}
    >
      <div className="login-card">
        <img
          src={Responsaveis}
          alt="Responsáveis"
          className="personagem"
        />

        <input
          className="senha"
          type="password"
          inputMode="numeric"
          maxLength="4"
          placeholder="PIN de 4 dígitos"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ''))
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') entrar();
          }}
        />

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button onClick={entrar} disabled={carregando}>
          {carregando ? 'Validando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}

export default Areapais;