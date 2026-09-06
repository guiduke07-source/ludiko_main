import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Coluna from '../../Components/Graficos/coluna';
import './configpais.css';
import Logo from '../../Components/imgs/logo.png';
import Popuppais from '../../Components/Popup/popuppais';
import Pizza from '../../Components/Graficos/pizza';
import Headerpais from '../../Components/Header/headerpais';
import SeletorFilhos from '../../Components/SeletorFilhos/SeletorFilhos';
import { buscarDadosDashboard, listarFilhos } from '../../services/dashboardApi';

const Configpais = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [nomeResponsavel, setNomeResponsavel] = useState('Responsável');
  const [listaFilhos, setListaFilhos] = useState([]);
  const [filhoAtivoId, setFilhoAtivoId] = useState(null);
  const [frequencia, setFrequencia] = useState([]);
  const [progresso, setProgresso] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const nomeSalvo = sessionStorage.getItem('nome_responsavel');
    if (nomeSalvo) {
      setNomeResponsavel(nomeSalvo);
    } else {
      const usuarioSalvo = sessionStorage.getItem('usuario');
      if (usuarioSalvo) {
        try {
          const u = JSON.parse(usuarioSalvo);
          if (u.nome) setNomeResponsavel(u.nome);
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function inicializarFilhos() {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/Login-Pais');
        return;
      }

      try {
        const filhos = await listarFilhos();
        setListaFilhos(filhos);

        if (filhos.length > 0) {
          const idInicial = filhos[0].id || filhos[0]._id;
          setFilhoAtivoId(idInicial);
        } else {
          setErro('Nenhuma criança encontrada para este responsável.');
          setCarregando(false);
        }
      } catch (err) {
        setErro(err.message);
        setCarregando(false);
      }
    }

    inicializarFilhos();
  }, [navigate]);

  const carregarMetricas = useCallback(async (criancaId) => {
    if (!criancaId) return;

    try {
      const dados = await buscarDadosDashboard(criancaId);
      setFrequencia(dados.frequencia || []);
      setProgresso(dados.progresso || []);
      setErro('');
    } catch (erroApi) {
      if (erroApi.message && erroApi.message.includes('401')) {
        sessionStorage.clear();
        navigate('/Login-Pais');
        return;
      }
      setErro(erroApi.message);
    } finally {
      setCarregando(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (filhoAtivoId) {
      carregarMetricas(filhoAtivoId);
    }
  }, [filhoAtivoId, carregarMetricas]);

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
          marginBottom: '20px',
        }}
      >
        <Headerpais onMenuClick={() => setShowPopup(true)} nomeResponsavel={nomeResponsavel} />
      </div>

      {showPopup && <Popuppais onClose={() => setShowPopup(false)} />}

      <SeletorFilhos
        criancas={listaFilhos}
        criancaAtivaId={filhoAtivoId}
        onSelecionar={(id) => setFilhoAtivoId(id)}
      />

      {carregando && <p style={{ textAlign: 'center' }}>Carregando dados do painel...</p>}
      {erro && <p style={{ textAlign: 'center', color: '#c53030' }}>{erro}</p>}

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