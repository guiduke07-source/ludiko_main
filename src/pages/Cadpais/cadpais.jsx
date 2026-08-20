import React, { useState } from 'react'; // ALTERADO: Importado o useState para capturar o que é digitado nos campos
import { useNavigate } from 'react-router-dom'; 
import './cadpais.css';
import AzulCad from '../../Components/Azulcad/azulcad';
import Logo from '../../Components/imgs/logo.png';

function Cadpais() {
  const navigate = useNavigate();

  // ALTERAÇÃO: Criados os estados para monitorar os inputs de e-mail, CPF e Senha
  const [email, setEmail] = useState('');
  const [cpfResponsavel, setCpfResponsavel] = useState('');
  const [senha, setSenha] = useState('');

  // ALTERAÇÃO: Função adicionada para tratar o clique no botão "Cadastrar"
  function handleCadastro(e) {
    e.preventDefault(); // Evita o recarregamento automático do navegador

    // ALTERAÇÃO: Configurado para redirecionar para a rota '/Acesso' após cadastrar
    navigate('/Acesso');
  }

  return (
    <div className="cadastro-container">
     
      {/* Lado Esquerdo - Contém botão de voltar e o formulário ocupando 60% */}
      <div className="left-cadastro-side">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="back-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="cadastro-box">
          <div className="logo-container">
             <img
                src={Logo}
                alt="Ludiko Logo"
                className="cadastro-logo"
             />
          </div>

          {/* ALTERAÇÃO: Adicionado o evento onSubmit apontando para a nova função handleCadastro */}
          <form className="cadastro-form" onSubmit={handleCadastro}>
            <div className="input-group">
              {/* ALTERAÇÃO: Vinculados value e onChange para o e-mail */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              {/* ALTERAÇÃO: Vinculados value e onChange para o CPF do responsável */}
              <input
                type="text"
                placeholder="CPF do responsável"
                value={cpfResponsavel}
                onChange={(e) => setCpfResponsavel(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              {/* ALTERAÇÃO: Vinculados value e onChange para a Senha */}
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-cadpais">
              Cadastrar
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito - Envelopa o seu componente customizado em 40% da tela */}
      <div className="right-cadastro-side">
        <AzulCad />
      </div>

    </div>
  );
}

export default Cadpais;