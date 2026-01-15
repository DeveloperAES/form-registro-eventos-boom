import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import ModalVerificacionCorreo from "./modals/ModalValidarCorreo";
import ModalUsuarioCreado from "./modals/ModalUsuarioCreado";
import ModalSms from "./modals/ModalValidarSMS";

import "../registroForm.css";

const RegistroForm = ({ eventoId }) => {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    correo_corporativo: "",
    telefono: "",
    empresa: "",
  });

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errors, setErrors] = useState({});

  // Evita envíos múltiples
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estados del flujo
  const [usuarioId, setUsuarioId] = useState(null);
  const [idRegistroEvento, setIdRegistroEvento] = useState(null);

  // Modales
  const [modalCorreo, setModalCorreo] = useState(false);
  const [modalUsuarioCreado, setModalUsuarioCreado] = useState(false);
  const [modalSms, setModalSms] = useState(false);


  /*Manejo de inputs*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /*Validación*/
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) newErrors.nombres = "El nombre es obligatorio.";
    if (!formData.apellidos.trim()) newErrors.apellidos = "El apellido es obligatorio.";
    if (!formData.dni.trim()) newErrors.dni = "El DNI es obligatorio.";

    if (!formData.correo_corporativo.trim()) {
      newErrors.correo_corporativo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_corporativo)) {
      newErrors.correo_corporativo = "El formato del correo no es válido.";
    }

    if (!formData.telefono) {
      newErrors.telefono = "El número de teléfono es obligatorio.";
    } else if (!isValidPhoneNumber(formData.telefono)) {
      newErrors.telefono = "El número de teléfono no es válido.";
    }

    if (!aceptaTerminos) newErrors.terminos = "Debes aceptar los términos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  /*Envio del formulario */


  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Procesando...");

    try {
      const res = await axios.post(
        `http://localhost:4000/api/registros/registrar`,
        { ...formData, evento_id: eventoId }
      );

      const data = res.data;

      if (data.estado === "USUARIO PRE-CREADO") {
        setUsuarioId(data.usuario_id);
        setModalCorreo(true);
        return;
      }

      if (data.estado === "REGISTRO PRE-CREADO") {
        setUsuarioId(data.usuario_id);
        setIdRegistroEvento(data.id_registro_evento);
        setModalSms(true);
        return;
      }

      toast.success("¡Registro exitoso!", {
        duration: 3000,
        position: "top-right",
        style: { backgroundColor: "#4CAF50", color: "white", borderRadius: "8px", fontSize: "16px", padding: "10px" },
        icon: "✔️",
      });
    } catch (error) {
      const msg = error.response?.data?.error || "Error en el registro.";
      toast.error(`${msg}`, {
        duration: 3000,
        position: "top-right",
        style: { backgroundColor: "#f44336", color: "white", borderRadius: "8px", fontSize: "16px", padding: "10px" },
        icon: "❌",
      });
    } finally {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);
    }
  };


  /* Cuando se valida correo correctamente */
  const handleCorreoValidado = () => {
    setModalCorreo(false);
    setModalUsuarioCreado(true);
  };

  const handleUsuarioCreadoClose = async () => {
    setModalUsuarioCreado(false);

    // Enviar de nuevo /registrar (segundo paso)
    try {
      const res = await axios.post(
        `http://localhost:4000/api/registros/registrar`,
        { ...formData, evento_id: eventoId }
      );

      const data = res.data;

      if (data.estado === "REGISTRO PRE-CREADO") {
        setUsuarioId(data.usuario_id);
        setIdRegistroEvento(data.id_registro_evento);
        setModalSms(true);
      }

    } catch (err) {
      toast.error("No se pudo continuar el registro.");
    }
  };

  /* RENDER*/
  return (
    <div className="registro-form-container">
      <Toaster position="top-right" />

      <h2>Formulario de Registro</h2>

      <form onSubmit={handleSubmit} className="registro-form">

        {/* Nombres y Apellidos */}
        {["nombres", "apellidos"].map((name) => (
          <div key={name} className="input-group">
            <label>{name === "nombres" ? "Nombres" : "Apellidos"}</label>
            <div className={`input-wrapper ${errors[name] ? "input-error" : ""}`}>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} />
              {/* {formData[name] && (
                <button type="button" className="clear-btn" onClick={() => clearField(name)}>
                  ✕
                </button>
              )} */}
            </div>
            {errors[name] && <p className="error-message">{errors[name]}</p>}
          </div>
        ))}

        {/* Correo */}
        <div className="input-group">
          <label>Correo Corporativo</label>
          <div className={`input-wrapper ${errors.correo_corporativo ? "input-error" : ""}`}>
            <input
              type="email"
              name="correo_corporativo"
              value={formData.correo_corporativo}
              onChange={handleChange}
            />
            {formData.correo_corporativo && (
              <button type="button" className="clear-btn" onClick={() => clearField("correo_corporativo")}>
                ✕
              </button>
            )}
          </div>
          {errors.correo_corporativo && (
            <p className="error-message">{errors.correo_corporativo}</p>
          )}
        </div>

        {/* DNI + Teléfono */}
        <div className="flex-row">
          <div className="input-group flex-item">
            <label>DNI</label>
            <div className={`input-wrapper ${errors.dni ? "input-error" : ""}`}>
              <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
              {formData.dni && (
                <button type="button" className="clear-btn" onClick={() => clearField("dni")}>
                  ✕
                </button>
              )}
            </div>
            {errors.dni && <p className="error-message">{errors.dni}</p>}
          </div>

          <div className="input-group flex-item">
            <label>Celular</label>
            <div className={`input-wrapper ${errors.telefono ? "input-error" : ""}`}>
              <PhoneInput
                international
                defaultCountry="PE"
                value={formData.telefono}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, telefono: value || "" }))
                }
                className="phone-number-input"
              />
            </div>
            {errors.telefono && <p className="error-message">{errors.telefono}</p>}
          </div>
        </div>

        {/* Empresa */}
        <div className="input-group">
          <label>Empresa</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
            />
            {formData.empresa && (
              <button type="button" className="clear-btn" onClick={() => clearField("empresa")}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Términos */}
        <div className={`checkbox ${errors.terminos ? "input-error" : ""}`}>
          <input
            type="checkbox"
            id="terminos"
            checked={aceptaTerminos}
            onChange={(e) => {
              setAceptaTerminos(e.target.checked);
              if (errors.terminos) setErrors((prev) => ({ ...prev, terminos: "" }));
            }}
          />
          <label htmlFor="terminos">He leído y acepto los términos y condiciones</label>
        </div>
        {errors.terminos && <p className="error-message">{errors.terminos}</p>}

        <button
          type="submit"
          className="btn-registrarse"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {/* ---------------- MODALES ---------------- */}

      {modalCorreo && (
        <ModalVerificacionCorreo
          usuarioId={usuarioId}
          onCorreoValidado={handleCorreoValidado}
        />
      )}

      {modalUsuarioCreado && (
        <ModalUsuarioCreado onClose={handleUsuarioCreadoClose} />
      )}

      {modalSms && (
        <ModalSms
          usuarioId={usuarioId}
          idRegistroEvento={idRegistroEvento}
        />
      )}
    </div>
  );
};

export default RegistroForm;
