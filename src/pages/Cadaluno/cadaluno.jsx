import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadaluno.css';
import IconAdicao from '../../Components/imgs/Adicao.png';

export default function CadCrianca() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  async function handleCadastrar(e) {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/Login-Pais');
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/cadastrar-crianca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome, cpf, senha })
      });

      const dados = await res.json();
      if (!res.ok || dados.erro) {
        throw new Error(dados.mensagem || 'Erro ao cadastrar criança.');
      }

      // Salva o ID da nova criança para ser selecionada no Configpais
      const novoId = dados.crianca?.id || dados.crianca?._id || dados.id || dados._id;
      if (novoId) {
        sessionStorage.setItem('crianca_ativa_id', novoId);
      }

      setMensagem({ tipo: 'sucesso', texto: 'Criança adicionada com sucesso!' });
      setTimeout(() => navigate('/Configpais'), 1500);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cad-crianca-wrapper">
      <div className="cad-crianca-card">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '4px' }}>
          <img
            src={IconAdicao}
            alt="Adicionar Criança"
            style={{
              width: '36px',
              height: '36px',
              objectFit: 'contain',
              imageRendering: 'pixelated'
            }}
          />
        </div>

        <h2>Adicionar Criança</h2>
        <p>Cadastre os dados de acesso para o seu filho(a).</p>

        <form onSubmit={handleCadastrar}>
          <div className="campo">
            <label>Nome da Criança</label>
            <input
              type="text"
              placeholder="Ex: Pedro Santos"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>CPF da Criança</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Senha de Acesso</label>
            <input
              type="password"
              placeholder="Senha do aluno"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {mensagem.texto && (
            <div className={`feedback ${mensagem.tipo}`}>{mensagem.texto}</div>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar Filho(a)'}
          </button>
        </form>
      </div>
    </div>
  );
}