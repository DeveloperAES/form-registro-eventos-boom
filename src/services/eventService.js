import apiClient from "./apiClient";

/**
 * Servicio para manejar operaciones relacionadas con eventos
 */
const eventService = {
    /**
     * Obtiene los detalles de un evento por su ID
     * @param {number} id - ID del evento
     * @returns {Promise} Promesa con los datos del evento
     */
    getEventById: async (id) => {
        try {
            const response = await apiClient.get(`/eventos/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtiene todos los eventos disponibles
     * @returns {Promise} Promesa con el array de eventos
     */
    getAllEvents: async () => {
        try {
            const response = await apiClient.get("/eventos");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default eventService;
