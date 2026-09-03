import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './controleTempo.css';

export default function ControleTempo() {
  const navigate = useNavigate();
  const [bloqueado, setBloqueado] = useState(false);
  const [pin, setPin] = useState('');
  const [erroPin, setErroPin] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // 1. Busca o limite configurado
    async function obterLimite() {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/tempo-limite', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dados = await res.json();
        if (dados && !dados.erro) {
          const minutos = dados.minutos !== undefined ? dados.minutos : 30;
          const limiteSegundos = minutos === 0 ? Infinity : minutos * 60;
          sessionStorage.setItem('limite_tempo_segundos', limiteSegundos);
        }
      } catch (e) {
        console.error('Erro ao carregar tempo limite:', e);
      }
    }

    obterLimite();

    // 2. Cronômetro contínuo a cada segundo
    const intervalo = setInterval(() => {
      const limite = parseInt(sessionStorage.getItem('limite_tempo_segundos') || '1800', 10);
      let tempoGasto = parseInt(sessionStorage.getItem('tempo_ativo_segundos') || '0', 10);

      tempoGasto += 1;
      sessionStorage.setItem('tempo_ativo_segundos', tempoGasto);

      if (limite !== Infinity && tempoGasto >= limite) {
        setBloqueado(true);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  async function handleDesbloquear(e) {
    e.preventDefault();
    setErroPin('');

    if (pin.length !== 4) {
      setErroPin('O PIN deve conter 4 dígitos.');
      return;
    }

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    setCarregando(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/verificar-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });

      const dados = await res.json();
      if (!res.ok || dados.erro) {
        throw new Error(dados.mensagem || 'PIN incorreto.');
      }

      // Zera o cronômetro e fecha o modal
      sessionStorage.setItem('tempo_ativo_segundos', '0');
      setBloqueado(false);
      setPin('');
    } catch (err) {
      setErroPin(err.message);
    } finally {
      setCarregando(false);
    }
  }

  if (!bloqueado) return null;

  return (
    <div className="tempo-bloqueio-overlay">
      <div className="tempo-bloqueio-card">
        <div className="bloqueio-icone">⏳</div>
        <h2>Tempo Esgotado!</h2>
        <p>O limite diário de atividades foi atingido.</p>
        <span className="instrucao-aviso">Peça para o responsável digitar o PIN para liberar:</span>

        <form onSubmit={handleDesbloquear} className="bloqueio-form">
          <input
            type="password"
            maxLength="4"
            inputMode="numeric"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            required
          />

          {erroPin && <p className="bloqueio-erro">{erroPin}</p>}

          <button type="submit" className="btn-liberar" disabled={carregando}>
            {carregando ? 'Validando...' : 'Liberar Acesso'}
          </button>
        </form>

        <button className="btn-ir-pais" onClick={() => navigate('/Areapais')}>
          Ir para Área dos Pais
        </button>
      </div>
    </div>
  );
}