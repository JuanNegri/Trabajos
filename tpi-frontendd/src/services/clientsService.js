// Codigo de “clientsService.js”

import axios from './api';

// Obtener clientes con búsqueda por nombre
export const getClients = async (search = '') => {
    try {
        const response = await axios.get('/clientes', { params: { nombre: search } });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Función para guardar un cliente (crear o modificar)
export const saveClient = async (clientData) => {
    const response = await axios.post('http://localhost:8080/api/clientes', clientData);
    return response.data;
};

// Dar de baja un cliente (baja lógica)
export const deleteClient = async (cuil) => {
    try {
        await axios.delete(`/clientes/${cuil}`);
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};