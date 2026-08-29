import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './alterarSenha.css';

export default function AlterarSenha() {
  const navigate = useNavigate();

  const [modoEsqueci, setModoEsqueci] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verSenhaNova, setVerSenhaNova] = useState(false);

  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (!senhaAtual || !senhaNova || !confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos.' });
      return;
    }

    if (senhaNova.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    if (senhaNova !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/Login-Pais');
      return;
    }

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

  const handleRecuperarSenha = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (!emailRecuperacao) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, informe seu e-mail.' });
      return;
    }

    setCarregando(true);

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperacao })
      });

      const dados = await resp.json();

      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Erro ao solicitar redefinição.');
      }

      setMensagem({
        tipo: 'sucesso',
        texto: 'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
      });
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="senha-page-wrapper">
      <div className="senha-card">
        <button className="senha-voltar-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <div className="senha-header">
          <div className="senha-badge-icon">{modoEsqueci ? '🔑' : '🔒'}</div>
          <h2>{modoEsqueci ? 'Recuperar Senha' : 'Alterar Senha'}</h2>
          <p>
            {modoEsqueci
              ? 'Informe seu e-mail cadastrado para receber as instruções de redefinição.'
              : 'Digite sua senha atual e escolha uma nova senha segura.'}
          </p>
        </div>

        {!modoEsqueci ? (
          <form onSubmit={handleAlterarSenha} className="senha-form">
            <div className="campo-grupo">
              <label>Senha Atual</label>
              <div className="input-com-icone">
                <input
                  type={verSenhaAtual ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-eye-btn"
                  onClick={() => setVerSenhaAtual(!verSenhaAtual)}
                >
                  {verSenhaAtual ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className="esqueceu-link-container">
              <button
                type="button"
                className="esqueceu-link-btn"
                onClick={() => {
                  setModoEsqueci(true);
                  setMensagem({ tipo: '', texto: '' });
                }}
              >
                Esqueceu sua senha atual?
              </button>
            </div>

            <div className="campo-grupo">
              <label>Nova Senha</label>
              <div className="input-com-icone">
                <input
                  type={verSenhaNova ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-eye-btn"
                  onClick={() => setVerSenhaNova(!verSenhaNova)}
                >
                  {verSenhaNova ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className="campo-grupo">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
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
        ) : (
          <form onSubmit={handleRecuperarSenha} className="senha-form">
            <div className="campo-grupo">
              <label>E-mail Cadastrado</label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                required
              />
            </div>

            {mensagem.texto && (
              <div className={`senha-feedback ${mensagem.tipo}`}>
                {mensagem.texto}
              </div>
            )}

            <button type="submit" className="senha-salvar-btn" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
            </button>

            <button
              type="button"
              className="voltar-alterar-btn"
              onClick={() => {
                setModoEsqueci(false);
                setMensagem({ tipo: '', texto: '' });
              }}
            >
              Lembrou a senha? Voltar para Alteração
            </button>
          </form>
        )}
      </div>
    </div>
  );
}