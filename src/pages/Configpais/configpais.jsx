import React, { useEffect, useState } from 'react';
import Coluna from '../../Components/Graficos/coluna';
import './configpais.css';
import Logo from '../../Components/imgs/logo.png';
import Popuppais from '../../Components/Popup/popuppais';
import Pizza from '../../Components/Graficos/pizza';
import Headerpais from '../../Components/Header/headerpais';
import { buscarDadosDashboard } from '../../services/dashboardApi';

const Configpais = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [frequencia, setFrequencia] = useState([]);
  const [progresso, setProgresso] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const dados = await buscarDadosDashboard();
        setFrequencia(dados.frequencia);
        setProgresso(dados.progresso);
      } catch (erroApi) {
        setErro(erroApi.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  return (
    <div className="configPais">
      <div
        className="headercenter"
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          padding: '0 20px',
          boxSizing: 'border-box',
          marginBottom: '40px',
        }}
      >
        <Headerpais onMenuClick={() => setShowPopup(true)} />
      </div>

      {showPopup && <Popuppais onClose={() => setShowPopup(false)} />}

      {carregando && <p>Carregando dados do painel...</p>}
      {erro && <p>{erro}</p>}

      {!carregando && !erro && (
        <>
          <div className="coluna">
            <div className="gcoluna">
              <Coluna frequencia={frequencia} />
            </div>

            <div className="Mascote">
              <img
                src={Logo}
                alt="Ludiko Logo"
                className="mascote-tela"
              />
            </div>
          </div>

          <div className="limite">
            <h1 className="textolimite">
              Desempenho por categoria
            </h1>

            <div className="Pizza">
              <Pizza progresso={progresso} />
            </div>

            <div className="legenda-unica">
              {progresso.map((categoria) => (
                <div
                  key={categoria.categoria_id}
                  className="legenda-item"
                >
                  <span
                    className="legenda-cor"
                    style={{ backgroundColor: categoria.cor }}
                  />
                  <span className="legenda-texto">
                    {categoria.titulo_categoria}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Configpais;