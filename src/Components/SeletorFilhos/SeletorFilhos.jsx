import React from 'react';

export default function SeletorFilhos({ criancas, criancaAtivaId, onSelecionar }) {
  if (!criancas || criancas.length <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '10px 0 25px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#ffffff',
          padding: '6px 14px',
          borderRadius: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '2px solid #bce4ec',
        }}
      >
        {criancas.map((filho) => {
          const id = filho.id || filho._id;
          const ativo = criancaAtivaId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelecionar(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: '22px',
                border: 'none',
                backgroundColor: ativo ? '#91C7D3' : 'transparent',
                color: ativo ? '#ffffff' : '#17656e',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                
              }}
            >
              {/*<span style={{ fontSize: '18px' }}>
                <img 
                src={iconeCrianca} 
                alt="Ícone de criança" 
                style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} 
                />
</span>*/}

<span>{filho.nome}</span>

              <span style={{ fontSize: '18px' }}></span>
              <span>{filho.nome}</span>

            </button>
          );
        })}
      </div>
    </div>
  );
}