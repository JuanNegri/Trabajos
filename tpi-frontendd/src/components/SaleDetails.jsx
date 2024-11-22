import React, { useState, useEffect } from 'react';
import { getSaleDetails } from '../services/salesService'; // Importa el servicio que obtiene los detalles

function SaleDetails({ nroVenta }) {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getSaleDetails(nroVenta);
                console.log("Detalles recibidos:", data);  // Verifica qué datos estás recibiendo
                setDetails(data.detallePedido || []);  // Asegúrate de que la respuesta tiene este formato
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los detalles de la venta:", error);
                setError("No se pudieron cargar los detalles de la venta.");
                setLoading(false);
            }
        };

        if (nroVenta) {
            fetchDetails();
        }
    }, [nroVenta]);

    if (loading) return <div>Cargando detalles...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2>Detalle de la Venta {nroVenta}</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {details.length === 0 ? (
                        <tr><td colSpan="3">No hay detalles disponibles para esta venta.</td></tr>
                    ) : (
                        details.map((detail) => (
                            <tr key={detail.idDetallePedido}>
                                <td>{detail.articulo.nombre_articulo}</td>
                                <td>{detail.articulo.precio}</td>
                                <td>{detail.cantidad}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SaleDetails;