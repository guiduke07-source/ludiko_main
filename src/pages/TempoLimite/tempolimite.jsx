import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tempoLimite.css';

export default function TempoLimite() {
  const navigate = useNavigate();
  const [minutos, setMinutos] = useState(120);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const opcoes = [
    { label: '30 Min', valor: 30, desc: 'Uso rápido' },
    { label: '1 Hora', valor: 60, desc: 'Moderado' },
    { label: '2 Horas', valor: 120, desc: 'Recomendado' },
    { label: '3 Horas', valor: 180, desc: 'Fim de semana' },
    { label: 'Livre', valor: 0, desc: 'Sem bloqueio' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://127.0.0.1:5000/api/auth/tempo-limite', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((dados) => {
        if (!dados.erro && dados.minutos !== undefined) {
          setMinutos(dados.minutos);
        }
      })
      .catch((err) => console.error('Erro ao carregar limite:', err));
  }, []);

  const salvar = async () => {
    const token = localStorage.getItem('token');
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/tempo-limite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ minutos: Number(minutos) })
      });

      const dados = await resp.json();

      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Erro ao salvar tempo.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Tempo limite atualizado com sucesso!' });
      setTimeout(() => navigate('/Configpais'), 1200);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="tempo-page-wrapper">
      <div className="tempo-card">
        <button className="tempo-voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="tempo-header">
          <div className="tempo-badge-icon">⏱️</div>
          <h2>Tempo Limite Diário</h2>
          <p>Defina quanto tempo por dia seu filho pode usar a plataforma.</p>
        </div>

        <div className="tempo-grid-opcoes">
          {opcoes.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              className={`tempo-card-opcao ${minutos === opcao.valor ? 'ativo' : ''}`}
              onClick={() => setMinutos(opcao.valor)}
            >
              <span className="opcao-titulo">{opcao.label}</span>
              <span className="opcao-desc">{opcao.desc}</span>
            </button>
          ))}
        </div>

        {mensagem.texto && (
          <div className={`tempo-feedback ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <button className="tempo-salvar-btn" onClick={salvar} disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}