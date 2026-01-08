import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../../modal.css";

const ModalVerificacionCorreo = ({ usuarioId, onCorreoValidado }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const validarCodigo = async () => {
    const codigo = otp.join("");

    if (codigo.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    const loadingToast = toast.loading("Verificando...");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/registros/validar-codigo-correo`, {
        usuario_id: usuarioId,
        codigo_correo: codigo,
      });

      toast.dismiss(loadingToast);
      toast.success("Correo validado correctamente");
      onCorreoValidado();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Código incorrecto");
    }
  };

  return (
    <div className="wrapper__modal">
      <div className="modal-otp">

        <h3>Verificación de Correo</h3>
        <p className="desc">Ingresa el código enviado a tu correo.</p>

        <div className="otp-container">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength="1"
              className="otp-box"
              value={v}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleBackspace(e, i)}
            />
          ))}
        </div>

        <button className="btn-validar" onClick={validarCodigo}>
          Validar
        </button>
      </div>
    </div>
  );
};

export default ModalVerificacionCorreo;
