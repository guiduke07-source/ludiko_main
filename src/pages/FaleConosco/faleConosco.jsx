import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './faleConosco.css';

export default function FaleConosco() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Recupera os dados do usuário autenticado no sessionStorage
    const usuarioSalvo = sessionStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        const usuario = JSON.parse(usuarioSalvo);
        if (usuario.nome) setNome(usuario.nome);
        if (usuario.email) setEmail(usuario.email);
      } catch (e) {
        console.error('Erro ao ler dados da sessão:', e);
      }
    }
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setStatus({ tipo: '', texto: '' });

    if (!assunto.trim() || !mensagem.trim()) {
      setStatus({ tipo: 'erro', texto: 'Preencha o assunto e a mensagem.' });
      return;
    }

    const token = sessionStorage.getItem('token');
    setEnviando(true);

    try {
      const resposta = await fetch('http://127.0.0.1:5000/api/auth/fale-conosco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          nome,
          email,
          assunto,
          mensagem
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Falha ao enviar mensagem.');
      }

      setStatus({
        tipo: 'sucesso',
        texto: 'Sua mensagem foi enviada com sucesso ao suporte!'
      });
      setAssunto('');
      setMensagem('');
    } catch (err) {
      setStatus({ tipo: 'erro', texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fale-page-wrapper">
      <div className="fale-card">
        <button className="fale-voltar-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <div className="fale-header">
          <div className="fale-badge-icon">💬</div>
          <h2>Fale Conosco</h2>
          <p>Dúvidas, sugestões ou problemas? Envie uma mensagem diretamente para nossa equipe.</p>
        </div>

        <form onSubmit={handleEnviar} className="fale-form">
          <div className="campo-grupo">
            <label>Seu Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Seu E-mail de Contato</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Assunto</label>
            <input
              type="text"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              placeholder="Ex: Dúvida sobre limite de tempo"
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Mensagem</label>
            <textarea
              rows="5"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              required
            />
          </div>

          {status.texto && (
            <div className={`fale-feedback ${status.tipo}`}>
              {status.texto}
            </div>
          )}

          <button type="submit" className="fale-enviar-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </div>
  );
}