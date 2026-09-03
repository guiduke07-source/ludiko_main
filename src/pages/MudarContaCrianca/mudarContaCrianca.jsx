import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mudarConta.css';

export default function MudarConta() {
  const navigate = useNavigate();
  const [criancas, setCriancas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarCriancas() {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/Login-Pais');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/minhas-criancas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await res.json();
        if (!res.ok || dados.erro) throw new Error(dados.mensagem);
        setCriancas(dados.criancas || []);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarCriancas();
  }, [navigate]);

  function selecionarCrianca(crianca) {
    const usuarioAtualizado = {
      id: crianca.id,
      nome: crianca.nome,
      cpf: crianca.cpf,
      tipo: 'crianca',
    };

    sessionStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    sessionStorage.setItem('nome_crianca', crianca.nome);
    sessionStorage.setItem('crianca_ativa_id', crianca.id);
    sessionStorage.setItem('tipo', 'crianca');

    navigate('/Inicioreal');
  }

  return (
    <div className="mudar-conta-wrapper">
      <div className="mudar-conta-card">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>
        <h2>Mudar para Conta de Criança</h2>
        <p>Escolha qual perfil de filho você deseja acessar agora:</p>

        {carregando && <p>Carregando crianças...</p>}
        {erro && <p className="erro">{erro}</p>}

        {!carregando && criancas.length === 0 && (
          <div className="sem-criancas">
            <p>Nenhuma criança cadastrada ainda.</p>
            <button onClick={() => navigate('/cadastrar-crianca')}>Cadastrar Criança</button>
          </div>
        )}

        <div className="lista-criancas">
          {criancas.map((c) => (
            <button
              key={c.id}
              className="card-filho-btn"
              onClick={() => selecionarCrianca(c)}
            >
              <span className="avatar">🧒</span>
              <div className="info">
                <strong>{c.nome}</strong>
                <span>{c.ano_escolar || '1º ano'}</span>
              </div>
              <span className="seta">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}