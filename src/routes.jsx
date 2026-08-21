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

        {/*
        <Route
          path="/Jogo"
          element={<MathConnectGame />}
        />

        <Route
          path="/Quiz"
          element={<Quiz />}
        />

        <Route
          path="/Teste"
          element={<Teste />}
        />
        */}
      </Routes>
    </PageTransition>
  );
}

export default AppRoutes;