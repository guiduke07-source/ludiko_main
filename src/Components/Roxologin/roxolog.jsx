import React from 'react';
import styles from './Roxo.module.css';
import logImg from '../imgs/Roxolog.png'; // Verifique se o caminho até a imagem está correto

function Roxologin() {
  return (
    <div 
      className={styles.onda} 
      style={{ backgroundImage: `url(${logImg})` }}
    >
    </div>
  );
}

export default Roxologin;