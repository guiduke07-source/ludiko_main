import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './historicoUso.css';
import IconGrafico from '../../Components/imgs/Grafico.png';

export default function HistoricoUso() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const criancaId = (usuario.criancas_ids && usuario.criancas_ids[0]) || usuario.id || '6a917cc2d447ee1302008431';

    if (!token) {
      navigate('/Login-Pais');
      return;
    }

    fetch(`http://127.0.0.1:5000/api/historico/crianca/${criancaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401) {
          sessionStorage.clear();
          navigate('/Login-Pais');
          return null;
        }
        return res.json();
      })
      .then((dados) => {
        if (dados && !dados.erro) setHistorico(dados.historico || []);
      })
      .catch((err) => console.error('Erro ao carregar histórico:', err))
      .finally(() => setCarregando(false));
  }, [navigate]);

  return (
    <div className="historico-page-wrapper">
      <div className="historico-card">
        <button className="historico-voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="historico-header">
          <div className="historico-badge-icon">
            <img
              src={IconGrafico}
              alt="Gráfico"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                imageRendering: 'pixelated'
              }}
            />
          </div>
          <h2>Histórico Semanal</h2>
          <p>Acompanhe o tempo de uso de semanas passadas.</p>
        </div>

        {carregando ? (
          <p>Carregando histórico...</p>
        ) : historico.length === 0 ? (
          <p className="historico-vazio">Nenhum registro anterior encontrado.</p>
        ) : (
          <div className="historico-lista">
            {historico.map((item, index) => (
              <div key={index} className="historico-item">
                <div className="historico-info">
                  <span className="historico-semana">Semana {item.semana_ano} ({item.ano})</span>
                  <span className="historico-pontos">⭐ {item.total_pontos} pontos</span>
                </div>
                <div className="historico-tempo">
                  ⏱️ {item.total_minutos} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}