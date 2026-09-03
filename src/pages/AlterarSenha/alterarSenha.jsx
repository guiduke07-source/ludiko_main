import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './alterarSenha.css';

export default function AlterarSenha() {
  const navigate = useNavigate();

  // Modo: "alterar" (com senha atual) ou "recuperar" (com código por e-mail)
  const [modo, setModo] = useState('alterar');
  const [etapaCodigo, setEtapaCodigo] = useState(1); // 1 = Digitar E-mail, 2 = Digitar Código e Nova Senha

  // Estados para Alterar Senha Padrão
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verSenhaNova, setVerSenhaNova] = useState(false);

  // Estados para Recuperação com Código via E-mail
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoConfirmacao, setCodigoConfirmacao] = useState('');
  const [novaSenhaRecuperacao, setNovaSenhaRecuperacao] = useState('');
  const [confirmarSenhaRecuperacao, setConfirmarSenhaRecuperacao] = useState('');

  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  // 1. Fluxo de Alteração de Senha Normal (Logado)
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
      setMensagem({ tipo: 'erro', texto: 'Sessão expirada. Faça login novamente ou use a recuperação por e-mail.' });
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
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  };

  // 2. Fluxo Recuperação: Solicitar Código
  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (!emailRecuperacao) {
      setMensagem({ tipo: 'erro', texto: 'Informe o e-mail cadastrado.' });
      return;
    }

    setCarregando(true);
    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/solicitar-codigo-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperacao })
      });

      const dados = await resp.json();
      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Erro ao enviar código de verificação.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Código de 6 dígitos enviado para o seu e-mail!' });
      setEtapaCodigo(2);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  };

  // 3. Fluxo Recuperação: Confirmar Código e Salvar Nova Senha
  const handleRedefinirComCodigo = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (novaSenhaRecuperacao !== confirmarSenhaRecuperacao) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    if (novaSenhaRecuperacao.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setCarregando(true);
    try {
      const resp = await fetch('http://127.0.0.1:5000/api/auth/redefinir-senha-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRecuperacao,
          codigo: codigoConfirmacao,
          nova_senha: novaSenhaRecuperacao
        })
      });

      const dados = await resp.json();
      if (!resp.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Código inválido ou expirado.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Senha redefinida com sucesso! Faça login com a nova senha.' });
      setTimeout(() => navigate('/Login-Pais'), 2000);
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
          <div className="senha-badge-icon">{modo === 'recuperar' ? '📩' : '🔒'}</div>
          <h2>{modo === 'recuperar' ? 'Recuperação por E-mail' : 'Alterar Senha'}</h2>
          <p>
            {modo === 'recuperar'
              ? (etapaCodigo === 1
                ? 'Receba um código de 6 números no seu e-mail para confirmar a troca.'
                : `Digite o código enviado para ${emailRecuperacao} e crie uma nova senha.`)
              : 'Digite sua senha atual e escolha uma nova senha segura.'}
          </p>
        </div>

        {mensagem.texto && (
          <div className={`senha-feedback ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* OPÇÃO 1: Alteração Normal por Senha Atual */}
        {modo === 'alterar' && (
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
                  setModo('recuperar');
                  setEtapaCodigo(1);
                  setMensagem({ tipo: '', texto: '' });
                }}
              >
                Esqueceu a senha? Receber confirmação por e-mail
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

            <button type="submit" className="senha-salvar-btn" disabled={carregando}>
              {carregando ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        )}

        {/* OPÇÃO 2: Solicitar Código via E-mail */}
        {modo === 'recuperar' && etapaCodigo === 1 && (
          <form onSubmit={handleSolicitarCodigo} className="senha-form">
            <div className="campo-grupo">
              <label>E-mail da Conta</label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="senha-salvar-btn" disabled={carregando}>
              {carregando ? 'Enviando código...' : 'Receber Código de Confirmação'}
            </button>

            <button
              type="button"
              className="voltar-alterar-btn"
              onClick={() => {
                setModo('alterar');
                setMensagem({ tipo: '', texto: '' });
              }}
            >
              Lembrou a senha? Voltar para alteração padrão
            </button>
          </form>
        )}

        {/* OPÇÃO 3: Confirmar Código e Salvar Senha Nova */}
        {modo === 'recuperar' && etapaCodigo === 2 && (
          <form onSubmit={handleRedefinirComCodigo} className="senha-form">
            <div className="campo-grupo">
              <label>Código de Confirmação (6 números)</label>
              <input
                type="text"
                placeholder="Ex: 582910"
                maxLength="6"
                value={codigoConfirmacao}
                onChange={(e) => setCodigoConfirmacao(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>Nova Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenhaRecuperacao}
                onChange={(e) => setNovaSenhaRecuperacao(e.target.value)}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmarSenhaRecuperacao}
                onChange={(e) => setConfirmarSenhaRecuperacao(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="senha-salvar-btn" disabled={carregando}>
              {carregando ? 'Redefinindo...' : 'Salvar Nova Senha'}
            </button>

            <button
              type="button"
              className="voltar-alterar-btn"
              onClick={() => setEtapaCodigo(1)}
            >
              Não recebeu? Enviar para outro e-mail
            </button>
          </form>
        )}
      </div>
    </div>
  );
}