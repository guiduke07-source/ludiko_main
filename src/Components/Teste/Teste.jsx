import React from 'react';
import './Teste.css';

// Recebemos a prop 'variante' (ex: 'azul' ou 'verde')
function Arco({ variante }) {
    return (
        // Usamos template literals (crases ` `) para juntar as classes CSS
        <div className={`curved-rectangle ${variante}`}> 
        </div>
    );
} 



export default Arco;