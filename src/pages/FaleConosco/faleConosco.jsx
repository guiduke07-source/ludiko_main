import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './faleConosco.css';

export default function FaleConosco() {
  const navigate = useNavigate();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setStatus({ tipo: '', texto: '' });

    if (!assunto.trim() || !mensagem.trim()) {
      setStatus({ tipo: 'erro', texto: 'Por favor, preencha todos os campos.' });
      return;
    }

    const token = localStorage.getItem('token');
    setEnviando(true);

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/fale-conosco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ assunto, mensagem })
      });

      const dados = await resp.json();

      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Falha ao enviar mensagem.');
      }

      setStatus({ tipo: 'sucesso', texto: 'Mensagem enviada com sucesso!' });
      setTimeout(() => navigate('/Configpais'), 1500);
    } catch (err) {
      setStatus({ tipo: 'erro', texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contato-page-wrapper">
      <div className="contato-card">
        <button className="contato-voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="contato-header">
          <div className="contato-badge-icon">💬</div>
          <h2>Fale Conosco</h2>
          <p>Tem alguma dúvida ou sugestão? Nossa equipe te ajuda.</p>
        </div>

        <form onSubmit={enviar} className="contato-form">
          <div className="campo-grupo">
            <label>Assunto</label>
            <input
              type="text"
              placeholder="Ex: Dúvida sobre o tempo limite"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Mensagem</label>
            <textarea
              rows="4"
              placeholder="Digite detalhadamente a sua dúvida ou mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />
          </div>

          {status.texto && (
            <div className={`contato-feedback ${status.tipo}`}>
              {status.texto}
            </div>
          )}

          <button type="submit" className="contato-enviar-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </div>
  );
}