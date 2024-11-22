import React, { useState, useEffect } from 'react';
import { saveClient } from '../services/clientsService';
import Aviso from './Aviso'; // Importa el componente de aviso

function ClientForm({ client, onSwitchView }) {
    const [formData, setFormData] = useState({
        cuil_cliente: '',
        nombre_cliente: '',
        fecha_nacimiento: ''
    });

    const [aviso, setAviso] = useState({ mensaje: '', tipo: '' }); // Estado para mensajes

    useEffect(() => {
        if (client) {
            setFormData({
                cuil_cliente: client.cuil_cliente,
                nombre_cliente: client.nombre_cliente,
                fecha_nacimiento: client.fecha_nacimiento.split('T')[0]
            });
        }
    }, [client]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { cuil_cliente, nombre_cliente, fecha_nacimiento } = formData;

        // Validación de CUIL
        if (!/^\d{10,}$/.test(cuil_cliente)) {
            setAviso({ mensaje: 'El CUIL debe tener al menos 10 dígitos.', tipo: 'danger' });
            return;
        }

        // Validación de Nombre
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre_cliente)) {
            setAviso({ mensaje: 'El nombre solo puede contener letras y espacios.', tipo: 'danger' });
            return;
        }

        // Validación de Edad (mayor a 18 años)
        const hoy = new Date();
        const fechaNacimiento = new Date(fecha_nacimiento);
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        if (edad < 18) {
            setAviso({ mensaje: 'La edad del cliente debe ser de mínimo 18 años.', tipo: 'danger' });
            return;
        }

        // Guardar cliente
        try {
            await saveClient(formData);
            setAviso({ mensaje: 'Cliente guardado con éxito.', tipo: 'success' });
            setTimeout(() => onSwitchView('list'), 2000); // Cambiar de vista después de un tiempo
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Mensaje específico para CUIL duplicado
                const errores = error.response.data.errores || [];
                if (errores.includes('El CUIL ingresado ya está registrado')) {
                    setAviso({ mensaje: 'El CUIL ingresado ya está registrado.', tipo: 'danger' });
                } else {
                    setAviso({ mensaje: 'Error al guardar el cliente. Intenta nuevamente.', tipo: 'danger' });
                }
            } else {
                setAviso({ mensaje: 'Error al guardar el cliente. Intenta nuevamente.', tipo: 'danger' });
            }
        }
    };

    return (
        <>
            <Aviso mensaje={aviso.mensaje} tipo={aviso.tipo} />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">CUIL</label>
                    <input
                        type="text"
                        name="cuil_cliente"
                        className="form-control"
                        value={formData.cuil_cliente}
                        onChange={handleChange}
                        required
                        disabled={!!client} // Deshabilitar si se está editando
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre_cliente"
                        className="form-control"
                        value={formData.nombre_cliente}
                        onChange={ handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="fecha_nacimiento"
                        className="form-control"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
 required
                    />
                </div>
                <button type="submit" className="btn btn-success">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => onSwitchView('list')}>Cancelar</button>
            </form>
        </>
    );
}

export default ClientForm;