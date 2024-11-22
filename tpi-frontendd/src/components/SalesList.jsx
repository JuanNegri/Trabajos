import React, { useState, useEffect } from 'react';
import { getSales, getClientByCuil, getVendedorByLeg } from '../services/salesService'; // Importa los nuevos métodos
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function SalesList({ onSwitchView }) {
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Para la redirección al detalle de la venta

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSales();
                
                // Añadir los nombres del cliente y vendedor a cada venta
                const salesWithNames = await Promise.all(data.Items.map(async (sale) => {
                    const cliente = await getClientByCuil(sale.cliente_cuil); // Obtener nombre del cliente
                    const vendedor = await getVendedorByLeg(sale.vendedor_leg); // Obtener nombre del vendedor
                    
                    return {
                        ...sale,
                        nombre_cliente: cliente ? cliente.nombre_cliente : 'No encontrado', // Asigna el nombre del cliente
                        vendedor_nombre: vendedor ? vendedor.nombre_vendedor : 'No encontrado' // Asigna el nombre del vendedor
                    };
                }));
                
                setSales(salesWithNames);
            } catch (error) {
                console.error("Error al obtener las ventas:", error);
                setError("No se pudieron cargar las ventas.");
            }
        };

        fetchSales();
    }, []);

    // Función para manejar el click en "Ver Detalles"
    const handleViewDetails = (nroVenta) => {
        navigate(`/ventas/detalle/${nroVenta}`); // Navegar a la página de detalles
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary mb-3" onClick={() => onSwitchView('form')}>Nueva Venta</button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nro Venta</th>
                        <th>CUIL Cliente</th>
                        <th>Nombre Cliente</th> {/* Nombre del cliente */}
                        <th>Vendedor</th> {/* Nombre del vendedor */}
                        <th>Fecha Venta</th>
                        <th>Sucursal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.nro_venta}>
                            <td>{sale.nro_venta}</td>
                            <td>{sale.cliente_cuil}</td>
                            <td>{sale.nombre_cliente}</td> {/* Mostrar nombre del cliente */}
                            <td>{sale.vendedor_nombre}</td> {/* Mostrar nombre del vendedor */}
                            <td>{format(new Date(sale.fecha_venta), 'yyyy-MM-dd')}</td>
                            <td>{sale.nom_sucursal}</td>
                            <td>
                                <button className="btn btn-info" onClick={() => handleViewDetails(sale.nro_venta)}>
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SalesList;