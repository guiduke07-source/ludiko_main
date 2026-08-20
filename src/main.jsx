import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GoogleFonts from 'google-fonts' // 1. Importa o pacote instalado via npm

// 2. Registra as fontes e os pesos que você quer usar em todas as páginas
GoogleFonts.add({
  'Baloo 2': ['400', '500', '600', '700', '800'],
  'Roboto': ['400', '700']
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)