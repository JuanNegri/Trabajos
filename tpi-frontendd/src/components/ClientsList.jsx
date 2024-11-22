import React, { useEffect, useState } from 'react';
import { getClients } from '../services/clientsService';

function ClientsList({ onSwitchView }) {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients(search);
                setClients(data.Items);
            } catch (error) {
                console.error("Error al obtener los clientes:", error);
                alert("Error al cargar los clientes. Asegúrate de estar autenticado."); // Manejo básico de errores
            }
        };
        fetchClients();
    }, [search]);

    // Formatear fechas al estilo "YYYY-MM-DD"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Devuelve el formato YYYY-MM-DD
    };

    return (
        <div>
            <button className="btn btn-primary mb-3" onClick={() => onSwitchView('form')}>Nuevo Cliente</button>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por nombre"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>CUIL</th>
                        <th>Nombre</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.cuil_cliente}>
                            <td>{client.cuil_cliente}</td>
                            <td>{client.nombre_cliente}</td>
                            <td>{formatDate(client.fecha_nacimiento)}</td> {/* Formatea la fecha */}
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => onSwitchView('form', client)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientsList;
