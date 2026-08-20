import React from 'react';
import styles from './Azul.module.css';
import logImg from '../imgs/Azullog.png'; // Verifique se o caminho até a imagem está correto

function Azullogin() {
  
  return (
    <div 
      className={styles.onda} 
      style={{ backgroundImage: `url(${logImg})` }}
    >
      
    </div>
  );
}

export default Azullogin;