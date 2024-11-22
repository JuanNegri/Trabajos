import axios from './api'; // Asegúrate de importar axios o tu cliente HTTP configurado.

// Función para obtener el token de acceso
const getAccessToken = () => {
    return localStorage.getItem('accessToken'); // O donde estés almacenando el token
};

// Obtener todas las ventas
export const getSales = async () => {
    try {
        const token = getAccessToken(); // Obtén el token
        const response = await axios.get('/ventas', {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

export const getSaleDetails = async (nroVenta) => {
    try {
        const token = getAccessToken(); // Obtén el token de acceso
        const response = await axios.get(`/detallePedido/${nroVenta}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Retorna los detalles de la venta
    } catch (error) {
        console.error("Error al obtener los detalles de la venta:", error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};

// Guardar o modificar una venta
export const saveSale = async (sale) => {
    try {
        const token = getAccessToken(); // Obtén el token
        if (sale.nro_venta) {
            await axios.put(`/ventas/${sale.nro_venta}`, sale, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                },
            });
        } else {
            await axios.post('/ventas', sale, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                },
            });
        }
    } catch (error) {
        console.error("Error al guardar la venta:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Obtener todos los artículos (productos)
export const getArticulos = async () => {
    try {
        const token = getAccessToken(); // Obtén el token
        const response = await axios.get('/articulos', {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },
        });
        return response.data; // Retorna la lista de artículos disponibles
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Validar CUIL de cliente
export const getClientByCuil = async (cuil) => {
    try {
        const response = await axios.get(`/clientes/${cuil}`); // Asegúrate de que la ruta sea correcta
        return response.data; // Retorna el cliente si existe
    } catch (error) {
        return null; // Retorna null si hay un error (cuil no existe)
    }
};

// Validar legajo de vendedor
export const getVendedorByLeg = async (legajo) => {
    try {
        const response = await axios.get(`/vendedores/${legajo}`); // Asegúrate de que la ruta sea correcta
        return response.data; // Retorna el vendedor si existe
    } catch (error) {
        return null; // Retorna null si hay un error (legajo no existe)
    }
};

// Obtener todas las sucursales
export const getSucursales = async () => {
    try {
        const response = await axios.get('/sucursales');
        return response.data;  // Devuelve las sucursales
    } catch (error) {
        console.error("Error al obtener las sucursales:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};

// Obtener vendedores de una sucursal
export const getVendedoresBySucursal = async (id_sucursal) => {
    try {
        const response = await axios.get(`/vendedores/sucursal/${id_sucursal}`);
        return response.data;  // Devuelve los vendedores de la sucursal
    } catch (error) {
        console.error("Error al obtener los vendedores:", error);
        throw error; // Lanza el error para que pueda ser manejado en el componente
    }
};