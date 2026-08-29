import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/home.jsx";
import Inicio from "./pages/Inicio/inicio.jsx";
import Logina from "./pages/Aluno/aluno.jsx";
import Loginp from "./pages/Pais/pais.jsx";
import Cadpais from "./pages/Cadpais/cadpais.jsx";
import Cadaluno from "./pages/Cadaluno/cadaluno.jsx";
import Acesso from "./pages/Acesso/acesso.jsx";
import Inicioreal from "./pages/Inicioreal/inicioreal.jsx";
import Areapais from "./pages/Areapais/areapais.jsx";
import Configpais from "./pages/Configpais/configpais.jsx";

// Telas do Menu Ativas
import TempoLimite from "./pages/TempoLimite/tempoLimite.jsx";
import MudarContaCrianca from "./pages/MudarContaCrianca/mudarContaCrianca.jsx";
import AlterarSenha from "./pages/AlterarSenha/alterarSenha.jsx";
import FaleConosco from "./pages/FaleConosco/faleConosco.jsx";
import HistoricoUso from "./pages/HistoricoUso/historicoUso.jsx";

import PageTransition from "./Components/PageTransition/PageTransition.jsx";

// import MathConnectGame from "./pages/Games/jogo.jsx";
// import Quiz from "./pages/Games/quiz.jsx";
// import Teste from "./pages/Teste/teste.jsx";

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Inicioreal" element={<Inicioreal />} />
        <Route path="/Login-Aluno" element={<Logina />} />
        <Route path="/Login-Pais" element={<Loginp />} />
        <Route path="/Cadpais" element={<Cadpais />} />
        <Route path="/Cadaluno" element={<Cadaluno />} />
        <Route path="/Acesso" element={<Acesso />} />
        <Route path="/Areapais" element={<Areapais />} />
        <Route path="/Configpais" element={<Configpais />} />

        {/* Rotas das opções ativas do menu */}
        <Route path="/tempo-limite" element={<TempoLimite />} />
        <Route path="/mudar-conta-crianca" element={<MudarContaCrianca />} />
        <Route path="/alterar-senha" element={<AlterarSenha />} />
        <Route path="/fale-conosco" element={<FaleConosco />} />
        <Route path="/historico-uso" element={<HistoricoUso />} />
      </Routes>
    </PageTransition>
  );
}

export default AppRoutes;