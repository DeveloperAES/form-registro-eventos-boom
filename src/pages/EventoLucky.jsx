import { useParams } from "react-router-dom";
import RegistroForm from "../components/RegistroForm";
import useEventData from "../hooks/useEventData";

const EventoLucky = () => {
  const { id } = useParams();
  const { loading, evento, error } = useEventData(id);

  if (loading) {
    return (
      <div className="form-container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Cargando evento...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Error al cargar el evento</h2>
        <p style={{ color: "#f44336" }}>{error}</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="form-container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Evento no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="form-container">
      <RegistroForm evento={evento} />
    </div>
  );
};

export default EventoLucky;

