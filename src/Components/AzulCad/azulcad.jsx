import React from 'react';
import styles from './Azulcad.module.css';
import logImg from '../imgs/Azulcad.png'; // Verifique se o caminho até a imagem está correto

function Azulcad() {
  return (
    <div 
      className={styles.onda} 
      style={{ backgroundImage: `url(${logImg})` }}
    >
        </div>
  );
}

export default Azulcad;