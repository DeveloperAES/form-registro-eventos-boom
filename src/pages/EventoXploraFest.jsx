import RegistroForm from "../components/RegistroForm";

const EventoXploraFest = () => {
  return (
    <div className="form-container">
      <h1 className="title__evento">Registro para Xplora Fest</h1>
      <RegistroForm eventoId={3} />
    </div>
  );
};

export default EventoXploraFest;
