import axios from "axios";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
    baseURL: "https://eventosbooomapi-aub8evccgse4aye8.eastus-01.azurewebsites.net/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log de errores en desarrollo
        if (import.meta.env.DEV) {
            console.error("API Error:", error);
        }

        // Personalizar mensajes de error
        const customError = {
            message: error.response?.data?.error || error.message || "Error de conexión",
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(customError);
    }
);

export default apiClient;
