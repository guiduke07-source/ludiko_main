import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tempoLimite.css';

export default function TempoLimite() {
  const navigate = useNavigate();
  const [minutos, setMinutos] = useState(120);
  const [isPersonalizado, setIsPersonalizado] = useState(false);
  const [horasCustom, setHorasCustom] = useState(1);
  const [minutosCustom, setMinutosCustom] = useState(30);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  // Botões fixos sem o botão de 3 horas
  const opcoesFixas = [
    { label: '30 Min', valor: 30, desc: 'Uso rápido' },
    { label: '1 Hora', valor: 60, desc: 'Moderado' },
    { label: '2 Horas', valor: 120, desc: 'Recomendado' },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      navigate('/Login-Pais');
      return;
    }

    fetch('http://127.0.0.1:5000/api/auth/tempo-limite', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((dados) => {
        if (!dados.erro && dados.minutos !== undefined) {
          const m = Number(dados.minutos);
          setMinutos(m);

          // Verifica se o valor veio de um tempo personalizado
          const valoresPadrao = [0, 30, 60, 120];
          if (!valoresPadrao.includes(m) && m > 0) {
            setIsPersonalizado(true);
            setHorasCustom(Math.floor(m / 60));
            setMinutosCustom(m % 60);
          }

          const segs = m === 0 ? Infinity : m * 60;
          sessionStorage.setItem('limite_tempo_segundos', segs);
        }
      })
      .catch((err) => console.error('Erro ao carregar limite:', err));
  }, [navigate]);

  const selecionarOpcaoFixa = (valor) => {
    setIsPersonalizado(false);
    setMinutos(valor);
  };

  const selecionarPersonalizado = () => {
    setIsPersonalizado(true);
    const total = horasCustom * 60 + minutosCustom;
    setMinutos(total);
  };

  const atualizarHorasCustom = (h) => {
    const novasHoras = Math.max(0, Math.min(12, Number(h)));
    setHorasCustom(novasHoras);
    setMinutos(novasHoras * 60 + minutosCustom);
  };

  const atualizarMinutosCustom = (m) => {
    const novosMinutos = Math.max(0, Math.min(59, Number(m)));
    setMinutosCustom(novosMinutos);
    setMinutos(horasCustom * 60 + novosMinutos);
  };

  const salvar = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      navigate('/Login-Pais');
      return;
    }

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

      const segs = Number(minutos) === 0 ? Infinity : Number(minutos) * 60;
      sessionStorage.setItem('limite_tempo_segundos', segs);

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
          {/* Opções pré-definidas */}
          {opcoesFixas.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              className={`tempo-card-opcao ${!isPersonalizado && minutos === opcao.valor ? 'ativo' : ''}`}
              onClick={() => selecionarOpcaoFixa(opcao.valor)}
            >
              <span className="opcao-titulo">{opcao.label}</span>
              <span className="opcao-desc">{opcao.desc}</span>
            </button>
          ))}

          {/* Botão Personalizado no lugar de 3 Horas */}
          <button
            type="button"
            className={`tempo-card-opcao ${isPersonalizado ? 'ativo' : ''}`}
            onClick={selecionarPersonalizado}
          >
            <span className="opcao-titulo">
              {isPersonalizado && minutos > 0 
                ? `${horasCustom}h ${minutosCustom}m` 
                : 'Personalizado'}
            </span>
            <span className="opcao-desc">Defina o tempo</span>
          </button>

          {/* Opção Livre (largura total) */}
          <button
            type="button"
            className={`tempo-card-opcao tempo-opcao-livre ${!isPersonalizado && minutos === 0 ? 'ativo' : ''}`}
            onClick={() => selecionarOpcaoFixa(0)}
          >
            <span className="opcao-titulo">Livre</span>
            <span className="opcao-desc">Sem bloqueio</span>
          </button>
        </div>

        {/* Painel de seleção de horas/minutos quando Personalizado estiver ativo */}
        {isPersonalizado && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: '#edf7fa',
              borderRadius: '16px',
              border: '2px solid #bce4ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontWeight: '700', color: '#17656e', fontSize: '14px' }}>Horas:</label>
              <input
                type="number"
                min="0"
                max="12"
                value={horasCustom}
                onChange={(e) => atualizarHorasCustom(e.target.value)}
                style={{
                  width: '58px',
                  padding: '6px',
                  borderRadius: '10px',
                  border: '1px solid #bce4ec',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#17656e'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontWeight: '700', color: '#17656e', fontSize: '14px' }}>Minutos:</label>
              <input
                type="number"
                min="0"
                max="59"
                step="5"
                value={minutosCustom}
                onChange={(e) => atualizarMinutosCustom(e.target.value)}
                style={{
                  width: '58px',
                  padding: '6px',
                  borderRadius: '10px',
                  border: '1px solid #bce4ec',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#17656e'
                }}
              />
            </div>
          </div>
        )}

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