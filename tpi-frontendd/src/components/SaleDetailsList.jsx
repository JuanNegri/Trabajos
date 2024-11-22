import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSaleDetails } from '../services/salesService';

function SaleDetailsList() {
    const { nroVenta } = useParams(); // Obtén el nroVenta de la URL
    const [details, setDetails] = useState(null);
    const [vendedor, setVendedor] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getSaleDetails(nroVenta); // Llama al servicio con nroVenta
                console.log(data); // Verifica los datos recibidos
                setDetails(data);
                if (data.length > 0 && data[0].venta && data[0].venta.vendedore) {
                    setVendedor(data[0].venta.vendedore.nombre_vendedor); // Cambia 'vendedore' a 'vendedor'
                }
            } catch (error) {
                console.error("Error al obtener los detalles de la venta:", error);
            }
        };
        fetchDetails();
    }, [nroVenta]); // Ejecutar cuando `nroVenta` cambia

    if (!details) {
        return <div>Cargando detalles...</div>;
    }

    // Calcular el total gastado
    const totalGastado = details.reduce((acc, detail) => {
        return acc + detail.articulo.precio * detail.cantidad;
    }, 0);

    return (
        <div>
            <h2>Detalles de la venta: {nroVenta}</h2>
            {vendedor && <h3>Vendedor: {vendedor}</h3>} {/* Mostrar el nombre del vendedor arriba de la tabla */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(detail => (
                        <tr key={detail.idDetallePedido}>
                            <td>{detail.articulo.nombre_articulo}</td>
                            <td>{detail.articulo.precio.toFixed(2)}</td>
                            <td>{detail.cantidad}</td>
                        </tr>
                    ))}
                    {/* Fila para mostrar el total gastado */}
                    <tr>
                        <td colSpan="2"><strong>Total:</strong></td>
                        <td><strong>{totalGastado.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default SaleDetailsList;