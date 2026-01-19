import apiClient from "./apiClient";

/**
 * Servicio para manejar operaciones de registro de usuarios a eventos
 */
const registroService = {
    /**
     * Registra un usuario a un evento
     * @param {Object} formData - Datos del formulario de registro
     * @param {number} eventoId - ID del evento
     * @returns {Promise} Promesa con la respuesta del registro
     */
    registrarUsuario: async (formData, eventoId) => {
        try {
            const response = await apiClient.post("/registros/registrar", {
                ...formData,
                evento_id: eventoId,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default registroService;
