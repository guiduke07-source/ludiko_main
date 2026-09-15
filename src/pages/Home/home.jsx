import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import "./Home.css";
import logo from "../../Components/imgs/logo.png";
import IconResponsavel from "../../Components/imgs/Responsavel.png";
import IconCrianca from "../../Components/imgs/Crianca.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* Lado Esquerdo */}
      <div className="left-side">
        <div className="content-box">

          <div className="logo-section">
            <motion.div
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={logo}
                alt="Ludiko Logo"
                className="logo-img"
              />
            </motion.div>
          </div>

          <h2 className="title-action">
            Entrar como:
          </h2>

          <div className="buttons-container">

            <button
              className="btn btn-pais"
              onClick={() => navigate("/Login-Pais")}
            >
              <span className="btn-icone">
                <img
                  src={IconResponsavel}
                  alt="Responsáveis"
                  style={{
                    width: '24px',
                    height: '24px',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                  }}
                />
              </span>

              <span className="btn-texto">
                Responsáveis
              </span>
            </button>

            <button
              className="btn btn-filho"
              onClick={() => navigate("/Login-Aluno")}
            >
              <span className="btn-icone">
                <img
                  src={IconCrianca}
                  alt="Aluno(a)"
                  style={{
                    width: '36px',
                    height: '36px',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                  }}
                />
              </span>

              <span className="btn-texto">
                Aluno(a)
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="right-side-image-container">

        <div className="quote-container">

          <p className="quote-text">
            "O começo é a parte mais importante do trabalho."
          </p>

          <p className="quote-author">
            — Platão
          </p>

        </div>

      </div>

    </div>
  );
}

export default Home;