import styles from './Frase.module.css';
import React from 'react';
import logImg from '../imgs/logimg.png';

function Frase() {

return (
        <div className={styles.onda}>
        <img src={logImg} alt="logImg" className='logImg'/>
        </div>
    )
}

export default Frase;