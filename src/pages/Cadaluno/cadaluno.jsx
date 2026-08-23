import React, { useState } from 'react'; // ALTERAÇÃO: Importado o useState para capturar o que o aluno digita no cadastro
import { useNavigate } from 'react-router-dom';
import './cadaluno.css';

import Logo from '../../Components/imgs/logo.png';
import Roxocad from '../../Components/Roxocad/roxocad';

function Cadaluno() { 
  const navigate = useNavigate();

  // ALTERAÇÃO: Criados os estados individuais para monitorar as 4 caixas de texto de cadastro do aluno
  const [cpfAluno, setCpfAluno] = useState('');
  const [email, setEmail] = useState('');
  const [cpfResponsavel, setCpfResponsavel] = useState('');
  const [senha, setSenha] = useState('');

  // ALTERAÇÃO: Função criada para processar o clique do botão "Cadastrar"
  function handleCadastro(e) {
    e.preventDefault(); // Impede o navegador de recarregar a página web

    // ALTERAÇÃO: Configurado para redirecionar para a rota '/Inicio' após concluir o formulário
    navigate('/Inicioreal');
  }

  return (
    <div className="cadastro-container">
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

          {/* ALTERAÇÃO: Adicionado o evento onSubmit apontando para a nossa nova função handleCadastro */}
          <form className="cadastro-form" onSubmit={handleCadastro}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nome da criança"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              {/* ALTERAÇÃO: Adicionados value e onChange para controlar o Email */}
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              {/* ALTERAÇÃO: Adicionados value e onChange para controlar o CPF do responsável */}
              <input 
                type="text" 
                placeholder="CPF do responsável" 
                value={cpfResponsavel}
                onChange={(e) => setCpfResponsavel(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              {/* ALTERAÇÃO: Adicionados value e onChange para controlar a Senha */}
              <input 
                type="password" 
                placeholder="Senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-cadastrar">
              Cadastrar
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito - Envolve o seu componente roxo customizado (40% da tela) */}
      <div className="right-cadastro-side">
        <Roxocad />
      </div>

    </div>
  );
}

export default Cadaluno;