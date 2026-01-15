import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../../modal.css";

const ModalSms = ({ usuarioId, idRegistroEvento }) => {
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

  const validarSMS = async () => {
    const codigo = otp.join("");

    if (codigo.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    const loadingToast = toast.loading("Validando SMS...");

    try {
      await axios.post(`http://localhost:4000/api/registros/validar-codigo-sms`, {
        usuario_id: usuarioId,
        codigo_sms: codigo,
        id_registro_evento: idRegistroEvento,
      });

      toast.dismiss(loadingToast);
      toast.success("🎉 Registro completado correctamente!");

      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Código inválido");
    }
  };

  return (
    <div className="wrapper__modal">
      <div className="modal-otp">

        <h3>Verificación SMS</h3>
        <p className="desc">Ingresa el código enviado a tu celular.</p>

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

        <button className="btn-validar" onClick={validarSMS}>
          Validar código
        </button>

      </div>
    </div>
  );
};

export default ModalSms;
