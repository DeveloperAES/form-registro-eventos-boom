import "../../modal.css";

const ModalUsuarioCreado = ({ onClose }) => {
  return (
    <div className="wrapper__modal">
      <div className="modal-basic">

        <h3>Usuario creado correctamente</h3>

        <p className="desc">
          Te hemos enviado un correo con tus credenciales de acceso.<br />
          Ahora continúa con la verificación SMS.
        </p>

        <button className="btn-validar" onClick={onClose}>
          Continuar
        </button>

      </div>
    </div>
  );
};

export default ModalUsuarioCreado;
