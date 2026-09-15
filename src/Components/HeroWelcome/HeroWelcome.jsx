import React from 'react';
import './HeroWelcome.css';
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

// Importe sua imagem local diretamente aqui
import logo from '../../Components/imgs/logo.png'; 

export default function HeroWelcome() {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-container">
        
        {/* Mascote na Lateral Esquerda com Flutuação e Sombra Sincronizada */}
        <div className="mascote-slot">
          <motion.div
            animate={{
              y: [-12, 12, -12],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={logo}
              alt="Ludiko Logo"
              className="mascote-img"
            />
          </motion.div>

          {/* Sombra sincronizada: encolhe quando o mascote sobe e cresce quando ele desce */}
          <motion.div
            className="sombra-mascote"
            animate={{
              scale: [0.7, 1, 0.7],
              opacity: [0.12, 0.25, 0.12],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Textos Centralizados */}
        <div className="hero-centro">
          <h2 className="frase-boas-vindas">Prepare-se para se divertir com</h2>
          <div className="logo-colorida">
            <span className="letra l-1">L</span>
            <span className="letra l-2">u</span>
            <span className="letra l-3">d</span>
            <span className="letra l-4">i</span>
            <span className="letra l-5">k</span>
            <span className="letra l-6">o</span>
            <span className="letra l-7">!</span>
          </div>
        </div>

      </div>
    </section>
  );
}