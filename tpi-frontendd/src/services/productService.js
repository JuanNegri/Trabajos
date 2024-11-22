import axios from './api';

// Obtener todos los artículos activos
export const getProducts = async () => {
    try {
        const response = await axios.get('/articulos'); // El backend devuelve solo productos activos
        return response.data; // Suponiendo que la respuesta tiene los productos en `data.Items`
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Guardar o modificar un artículo
export const saveProduct = async (product) => {
    try {
        if (product && product.id_articulo) {
            // Modificar artículo existente
            await axios.put(`/articulos/${product.id_articulo}`, product);
        } else if (product) {
            // Crear nuevo artículo
            await axios.post('/articulos', product);
        } else {
            throw new Error("Producto inválido");
        }
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Eliminar un artículo (baja lógica)
export const deleteProduct = async (id) => {
    try {
        await axios.delete(`/articulos/${id}`); // Eliminar artículo en backend (baja lógica)
    } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};
