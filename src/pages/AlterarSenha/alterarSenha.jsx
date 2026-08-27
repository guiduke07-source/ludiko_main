import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './alterarSenha.css';

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (!senhaAtual || !senhaNova) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos.' });
      return;
    }

    if (senhaNova.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    const token = localStorage.getItem('token');
    setCarregando(true);

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/alterar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ senha_atual: senhaAtual, senha_nova: senhaNova })
      });

      const dados = await resp.json();

      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Erro ao alterar senha.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      setTimeout(() => navigate('/Configpais'), 1500);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="senha-page-wrapper">
      <div className="senha-card">
        <button className="senha-voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="senha-header">
          <div className="senha-badge-icon">🔒</div>
          <h2>Alterar Senha</h2>
          <p>Digite sua senha atual e escolha uma nova senha segura.</p>
        </div>

        <form onSubmit={handleSubmit} className="senha-form">
          <div className="campo-grupo">
            <label>Senha Atual</label>
            <input
              type="password"
              placeholder="Digite sua senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
            />
          </div>

          <div className="campo-grupo">
            <label>Nova Senha</label>
            <input
              type="password"
              placeholder="Digite a nova senha (mínimo 6 dígitos)"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              required
            />
          </div>

          {mensagem.texto && (
            <div className={`senha-feedback ${mensagem.tipo}`}>
              {mensagem.texto}
            </div>
          )}

          <button type="submit" className="senha-salvar-btn" disabled={carregando}>
            {carregando ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}