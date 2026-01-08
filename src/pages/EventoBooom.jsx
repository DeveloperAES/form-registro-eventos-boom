import RegistroForm from "../components/RegistroForm";

const EventoBooom = () => {
  return (
    <div className="form-container">
      <h1 className="w-max-xl mx-auto text-cen  ter">Registro para evento Especial Booom</h1>
      <RegistroForm eventoId={4} />
    </div>
  );
};

export default EventoBooom;
