import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
    console.warn('Advertencia: EXPO_PUBLIC_API_URL no está definida en el archivo .env');
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Ocurrió un error inesperado de red.';

    if (error.response) {
      errorMessage = error.response.data?.message || `Error del servidor (${error.response.status})`;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);
