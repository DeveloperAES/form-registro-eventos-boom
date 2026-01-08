import RegistroForm from "../components/RegistroForm";

const EventoLucky = () => {
  return (
    <div className="form-container">
      <h1 className="title__evento">Registro para Fiesta fin de año grupo Lucky</h1>
      <RegistroForm eventoId={2} />
    </div>
  );
};

export default EventoLucky;
