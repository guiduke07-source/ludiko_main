import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Popup from '../../Components/Popup/popup';
import Inicio from '../Inicio/inicio';
import ControleTempo from '../../Components/ControleTempo/ControleTempo';
import HeroWelcome from '../../Components/HeroWelcome/HeroWelcome';

function Inicioreal() {
  const [showPopup, setShowPopup] = useState(false);
  const [nomeAluno, setNomeAluno] = useState('Aluno');

  useEffect(() => {
    const tipo = sessionStorage.getItem('tipo');

    if (tipo === 'responsavel') {
      const nomeResp = sessionStorage.getItem('nome_responsavel');
      if (nomeResp) {
        setNomeAluno(nomeResp);
        return;
      }
    }

    const nomeCrianca = sessionStorage.getItem('nome_crianca');
    if (nomeCrianca) {
      setNomeAluno(nomeCrianca);
      return;
    }

    try {
      const u = JSON.parse(sessionStorage.getItem('usuario') || '{}');
      if (u.nome) setNomeAluno(u.nome);
    } catch {
      setNomeAluno('Aluno');
    }
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'transparent' }}>
      <ControleTempo />

      <div
        className="headercenter"
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          padding: '0 20px',
          boxSizing: 'border-box',
        }}
      >
        <Header onMenuClick={() => setShowPopup(true)} nomeAluno={nomeAluno} />
      </div>

      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
        <HeroWelcome/>

      <main style={{ width: '100%', marginTop: '20px' }}>
        <Inicio nomeAluno={nomeAluno} />
      </main>

      
    </div>
  );
}

export default Inicioreal;