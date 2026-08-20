import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importado para navegação
import { IoMdCloseCircleOutline } from "react-icons/io";
import './popup.css';

function Popup({ onClose }) {
    const popupRef = useRef();
    const navigate = useNavigate(); // Instanciando o hook de navegação

    const closePopup = (e) => {
        if (popupRef.current === e.target) {
            onClose();
        }
    }

    return (
        /* Container principal que cobre a tela. */
        <div 
            ref={popupRef} 
            onClick={closePopup} 
            className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-end items-start pt-20 pr-16'
        >
            {/* Card do Popup */}
            <div className='bg-[#D1C4E9] w-72 rounded-[32px] p-6 flex flex-col items-center shadow-xl relative border border-white/20'>
                
                {/* Botão de Fechar no extremo canto superior direito */}
                <button 
                    onClick={onClose} 
                    className='absolute top-1 right-1 text-purple-900/60 hover:text-purple-900 transition-colors z-10'
                >
                    <IoMdCloseCircleOutline size={24}/>
                </button>

                {/* Nome do Usuário - Adicionado mt-4 para dar distância segura do botão X */}
                <h2 className='text-[#3F2B66] text-lg font-semibold mt-4 tracking-wide font-sans'>
                    Maria
                </h2>

                {/* Grupo de Botões Principais */}
                <div className='w-full flex flex-col gap-3 mt-6'>
                    <button 
                        onClick={() => alert('Abrir Avatar')}
                        className='w-full py-2.5 bg-white text-[#3F2B66] font-medium rounded-full shadow-sm hover:bg-purple-50 transition-all text-sm border border-purple-200'
                    >
                        Avatar
                    </button>
                    
                    <button 
                        onClick={() => {
                            navigate('/Areapais'); // Altere para a rota exata definida no seu arquivo App.js/Routes
                            onClose(); // Fecha o popup ao navegar
                        }}
                        className='w-full py-2.5 bg-white text-[#3F2B66] font-medium rounded-full shadow-sm hover:bg-purple-50 transition-all text-sm border border-purple-200'
                    >
                        Ir para conta do responsável
                    </button>
                </div>

                {/* Separador sutil */}
                <hr className='w-full border-purple-300/40 my-5' />

                {/* Ações da Conta (Rodapé) */}
                <div className='w-full flex flex-col gap-3 items-center text-sm font-medium'>
                    <button 
                        onClick={() => {
                            navigate('/'); // Redireciona para a Home ao sair
                            onClose();
                        }}
                        className='flex items-center gap-2 text-[#5E4A85] hover:text-purple-900 transition-colors'
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sair da conta
                    </button>

                    <button 
                        onClick={() => {
                            navigate('/'); // Redireciona para a Home ao excluir
                            onClose();
                        }}
                        className='flex items-center gap-2 text-[#D32F2F] hover:text-red-700 transition-colors'
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Excluir conta
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Popup;