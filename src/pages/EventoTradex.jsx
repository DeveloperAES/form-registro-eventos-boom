import RegistroForm from "../components/RegistroForm";

const EventoA = () => {
  return (
    <div className="form-container">
      <h1 className="title__evento">Registro para Evento Tradex</h1>
      <RegistroForm eventoId={1} />
    </div>
  );
};

export default EventoA;
