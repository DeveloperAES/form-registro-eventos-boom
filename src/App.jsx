import { Routes, Route, Link } from "react-router-dom";
import EventoTradex from "./pages/EventoTradex";
import EventoLucky from "./pages/EventoLucky";
import EventoXploraFest from "./pages/EventoXploraFest";
import EventoBooom from "./pages/EventoBooom";
import ModalValidarPage from "./pages/ModalPage";

/*Modales de registro*/
import ModalPage from "./pages/ModalPage";
import "./index.css";

function App() {
  return (
    <div>
      <Routes>
        {/* Ruta dinámica: usa el id en la URL */}
        <Route path="/evento/:id" element={<EventoLucky />} />

        {/* Redirección por defecto a evento con ID 2 */}
        {/* <Route path="/" element={<EventoLucky />} /> */}
      </Routes>
    </div>
  );
}

export default App;

