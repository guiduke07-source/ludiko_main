import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import './popup.css';

function Popup({ onClose }) {
  const popupRef = useRef();
  const navigate = useNavigate();

  let nomeCrianca = 'Criança';

  try {
    // 1. Prioriza a chave individual da criança ativa
    const nomeSalvo = sessionStorage.getItem('nome_crianca');
    if (nomeSalvo) {
      nomeCrianca = nomeSalvo;
    } else {
      // 2. Fallback para o usuário da sessão
      const usuarioSalvo = sessionStorage.getItem('usuario');
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        if (usuario.nome) {
          nomeCrianca = usuario.nome;
        }
      }
    }
  } catch {
    nomeCrianca = 'Criança';
  }

  const closePopup = (e) => {
    if (popupRef.current === e.target) {
      onClose();
    }
  };

  const handleSair = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/Login-Aluno');
    onClose();
  };

  return (
    <div 
      ref={popupRef} 
      onClick={closePopup} 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-end items-start pt-20 pr-16"
    >
      <div className="bg-[#D1C4E9] w-72 rounded-[32px] p-6 flex flex-col items-center shadow-xl relative border border-white/20">
        
        <button 
          onClick={onClose} 
          className="absolute top-1 right-1 text-purple-900/60 hover:text-purple-900 transition-colors z-10"
        >
          <IoMdCloseCircleOutline size={24} />
        </button>

        <h2 className="text-[#3F2B66] text-lg font-semibold mt-4 tracking-wide font-sans">
          {nomeCrianca}
        </h2>

        <div className="w-full flex flex-col gap-3 mt-6">
          <button 
            onClick={() => {
              navigate('/Areapais');
              onClose();
            }}
            className="w-full py-2.5 bg-white text-[#3F2B66] font-medium rounded-full shadow-sm hover:bg-purple-50 transition-all text-sm border border-purple-200"
          >
            Ir para conta do responsável
          </button>
        </div>

        <hr className="w-full border-purple-300/40 my-5" />

        <div className="w-full flex flex-col gap-3 items-center text-sm font-medium">
          <button 
            onClick={handleSair}
            className="flex items-center gap-2 text-[#5E4A85] hover:text-purple-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair da conta
          </button>

          <button 
            onClick={() => {
              navigate('/');
              onClose();
            }}
            className="flex items-center gap-2 text-[#D32F2F] hover:text-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir conta
          </button>
        </div>

      </div>
    </div>
  );
}

export default Popup;