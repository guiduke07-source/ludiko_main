import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';import { IoMdCloseCircleOutline } from "react-icons/io";
// Importando ícones bonitos e modernos para as opções do menu
import { Settings, Clock, RefreshCw, Lock, MessageSquare, ChevronRight, LogOut, Trash2 } from 'lucide-react';

function Popuppais({ onClose }) {
    const popupRef = useRef();
const navigate = useNavigate();

function sairDaConta() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');

  onClose();
  navigate('/Login-Pais', { replace: true });
}
    const closePopup = (e) => {
        if (popupRef.current === e.target) {
            onClose();
        }
    }

    return (
        /* Container principal que cobre a tela e posiciona o menu no canto superior direito */
        <div 
            ref={popupRef} 
            onClick={closePopup} 
            className='fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex justify-end items-start pt-20 pr-16'
        >
            {/* Card do Popup (Tom azul-claro/esverdeado do fundo) */}
            <div className='bg-[#BCE3E6] w-80 rounded-[32px] p-4 flex flex-col items-center shadow-xl relative border border-white/30'>
                
                {/* Botão de Fechar */}
                <button 
                    onClick={onClose} 
                    className='absolute top-4 right-4 text-[#3A6B70]/60 hover:text-[#3A6B70] transition-colors z-10'
                >
                    <IoMdCloseCircleOutline size={22}/>
                </button>

                {/* 1. Banner Superior: "Cuide e proteja sua criança" */}
                <div className='w-full bg-[#E3B0C7] rounded-2xl p-3 flex items-center gap-3 mt-4 shadow-sm'>
                    {/* Espaço para a ilustração dos pais/família */}
                    <div className='w-12 h-12 flex-shrink-0 bg-white/40 rounded-xl flex items-center justify-center text-xl'>
                        👨‍👩‍👧
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[#4A2837] text-xs font-bold leading-tight'>
                            Cuide e proteja sua
                        </span>
                        <span className='text-[#4A2837] text-xs font-bold leading-tight'>
                            criança! ✨
                        </span>
                    </div>
                </div>

                {/* 2. Lista de Opções (Card Azul Central) */}
                <div className='w-full bg-[#BCE3E6] rounded-2xl p-4 flex flex-col gap-4 mt-4 shadow-inner'>
                    
                    {/* Item 1: Configurar */}
                    <button className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors text-left group'>
                        <div className='flex items-center gap-3 text-[#234E52]'>
                            <Settings size={20} />
                            <div className='flex flex-col'>
                                <span className='text-sm font-bold leading-tight'>Configurar</span>
                                <span className='text-[10px] opacity-70 font-medium'>acesso aos jogos</span>
                            </div>
                        </div>
                        <ChevronRight size={16} className='text-[#234E52]/60 group-hover:translate-x-0.5 transition-transform' />
                    </button>

                    {/* Item 2: Tempo-limite */}
                    <button className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors text-left group'>
                        <div className='flex items-center gap-3 text-[#234E52]'>
                            <Clock size={20} />
                            <span className='text-sm font-bold'>Tempo-limite de atividades</span>
                        </div>
                        <ChevronRight size={16} className='text-[#234E52]/60 group-hover:translate-x-0.5 transition-transform' />
                    </button>

                    {/* Item 3: Mudar para conta de criança */}
                    <button className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors text-left group'>
                        <div className='flex items-center gap-3 text-[#234E52]'>
                            <RefreshCw size={20} />
                            <span className='text-sm font-bold'>Mudar para conta de criança</span>
                        </div>
                        <ChevronRight size={16} className='text-[#234E52]/60 group-hover:translate-x-0.5 transition-transform' />
                    </button>

                    {/* Item 4: Alterar senha */}
                    <button className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors text-left group'>
                        <div className='flex items-center gap-3 text-[#234E52]'>
                            <Lock size={20} />
                            <span className='text-sm font-bold'>Alterar senha</span>
                        </div>
                        <ChevronRight size={16} className='text-[#234E52]/60 group-hover:translate-x-0.5 transition-transform' />
                    </button>

                    {/* Item 5: Fale conosco */}
                    <button className='w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/20 transition-colors text-left group'>
                        <div className='flex items-center gap-3 text-[#234E52]'>
                            <MessageSquare size={20} />
                            <span className='text-sm font-bold'>Fale conosco</span>
                        </div>
                        <ChevronRight size={16} className='text-[#234E52]/60 group-hover:translate-x-0.5 transition-transform' />
                    </button>

                </div>

                {/* 3. Rodapé estático (Sair e Excluir) */}
                <div className='w-full flex flex-col gap-2.5 items-center text-xs font-bold mt-5 mb-2'>
                    <button 
                        onClick={sairDaConta}
                        className='flex items-center gap-2 text-[#3A6B70] hover:text-[#1D3B3E] transition-colors'
                    >
                        <LogOut size={14} />
                        Sair da conta
                    </button>

                    <button 
                        onClick={() => alert('Excluir conta')}
                        className='flex items-center gap-2 text-[#C14747] hover:text-red-800 transition-colors'
                    >
                        <Trash2 size={14} />
                        Excluir conta
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Popuppais;