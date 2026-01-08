import { Routes, Route, Link } from "react-router-dom";
import EventoTradex from "./pages/EventoTradex";
import EventoLucky from "./pages/EventoLucky";
import EventoXploraFest from "./pages/EventoXploraFest";
import EventoBooom from "./pages/EventoBooom";
import ScannerPage from "./pages/PageQr";

/*Modales de registro*/
import ModalPage from "./pages/ModalPage";
import "./index.css";

function App() {
  return (
    <div>
      {/* <nav style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <Link to="/evento/4">Evento 1 (Dinámico)</Link>
        <Link to="/evento/6">Evento 2 (Dinámico)</Link>
        <Link to="/evento-tradex">Evento Tradex</Link>
        <Link to="/evento-gaming">Evento Gaming</Link>
      </nav> */}

      <Routes>
        <Route path="/modal" element={<ModalPage />} />
        {/* Opción dinámica: usa el id en la URL */}
        {/* <Route path="/evento/:id" element={<EventoRouter />} /> */}

        {/* Opción fija: distintas páginas con distintos IDs */}
        <Route path="/evento-tradex" element={<EventoTradex />} />
        <Route path="/evento-lucky" element={<EventoLucky />} />
        <Route path="/evento-xplora" element={<EventoXploraFest />} />
        <Route path="/evento-booom" element={<EventoBooom />} />
        <Route path="/scanner-page" element={<ScannerPage />} />

      </Routes>
    </div>
  );
}

export default App;
