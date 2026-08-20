
import React, { useState } from 'react'; // ALTERAÇÃO: Importado o useState para gerenciar as caixas de texto do Aluno
import { useNavigate, Link } from 'react-router-dom'; // ALTERAÇÃO: Importado o Link para fazer o redirecionamento sem recarregar
import './Login-A.css'; 
import Roxologin from '../../Components/Roxologin/roxolog';
import Logo from '../../Components/imgs/logo.png'; // ALTERAÇÃO: Importado para renderizar a logo dentro da caixa estruturada

function Logina() { 
  const navigate = useNavigate();

  // ALTERAÇÃO: Criados os estados para monitorar o CPF e a Senha digitados pelo aluno
  const [cpfAluno, setCpfAluno] = useState('');
  const [senha, setSenha] = useState('');

  // ALTERAÇÃO: Função adicionada para tratar o envio do formulário
  function handleLogin(e) {
    e.preventDefault(); // Impede o comportamento padrão do HTML de recarregar a página

    // ALTERAÇÃO: Configurado para redirecionar para a rota '/Inicioreal' após o clique em Iniciar
    navigate('/Inicioreal'); 
  }

  return (
    <div className="cadastro-container">
      
      {/* Lado Esquerdo - Componente da onda Roxa (40% da tela) */}
      <div className="left-login-side">
        <Roxologin />
      </div>

      {/* Lado Direito - Caixa do Formulário e Botões (60% da tela) */}
      <div className="right-login-side">
        
        {/* Botão voltar posicionado dentro do lado direito */}
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

        {/* ALTERAÇÃO: Retirado o componente isolado Cadastroboxaluno e trazido o HTML para cá para padronizar os botões */}
        <div className="cadastro-box">
          <div className="logo-container">
             <img
                src={Logo}
                alt="Ludiko Logo"
                className="cadastro-logo"
             />
          </div>

          {/* ALTERAÇÃO: Adicionado o onSubmit chamando a nossa função de login */}
          <form className="cadastro-form" onSubmit={handleLogin}>
            <div className="input-group">
              {/* ALTERAÇÃO: Vinculados o value e o onChange para atualizar o estado do CPF do Aluno */}
              <input 
                type="text" 
                placeholder="CPF do aluno" 
                value={cpfAluno}
                onChange={(e) => setCpfAluno(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              {/* ALTERAÇÃO: Vinculados o value e o onChange para atualizar o estado da Senha */}
              <input 
                type="password" 
                placeholder="Senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn-cadastro">
              Iniciar
            </button>

            {/* ALTERAÇÃO: Trocado de tags 'li' para 'p' e 'a' para 'Link to="/Cadaluno"' redirecionando corretamente */}
            <p className="cadastro-redirect">
              Ainda não possui conta? <Link to="/Cadaluno">Cadastre-se</Link>
            </p>
          </form>

          {/* ALTERAÇÃO: Adicionado o botão inferior para alternar para a tela de Login do Responsável */}
          <button
            className="btn-pai"
            onClick={() => navigate('/Login-Pais')}
          >
            <span className="btn-icon">👥</span>
            <span className="btn-text">Responsável</span>
          </button>
        </div>
      </div>
    
    </div>
  );
}

export default Logina;