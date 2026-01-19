import { useState, useEffect } from "react";
import eventService from "../services/eventService";

/**
 * Custom hook para obtener datos de un evento
 * @param {number} eventId - ID del evento a buscar
 * @returns {Object} Estado con loading, evento y error
 */
const useEventData = (eventId) => {
    const [loading, setLoading] = useState(true);
    const [evento, setEvento] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            if (!eventId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await eventService.getEventById(eventId);
                setEvento(data);
            } catch (err) {
                setError(err.message || "Error al cargar el evento");
                console.error("Error fetching event:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    return { loading, evento, error };
};

export default useEventData;
