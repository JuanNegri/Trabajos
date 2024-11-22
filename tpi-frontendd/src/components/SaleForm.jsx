import React, { useState, useEffect } from 'react';
import { saveSale, getClientByCuil, getVendedorByLeg, getArticulos, getSucursales, getVendedoresBySucursal } from '../services/salesService';
import Aviso from './Aviso'; // Asegúrate de importar el componente Aviso


function SaleForm({ sale, onSwitchView }) {
    const [formData, setFormData] = useState(sale || {
        cliente_cuil: '',
        vendedor_leg: '',
        fecha_venta: '',
        nom_sucursal: '',
        detalles: []  // Aquí se guardarán los detalles de los artículos
    });
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'danger'
    const [articulos, setArticulos] = useState([]);  // Para almacenar los artículos disponibles
    const [sucursales, setSucursales] = useState([]); // Para almacenar las sucursales
    const [vendedores, setVendedores] = useState([]); // Para almacenar los vendedores disponibles
    const [selectedArticulo, setSelectedArticulo] = useState('');
    const [selectedSucursal, setSelectedSucursal] = useState('');
    const [selectedVendedor, setSelectedVendedor] = useState('');
    const [cantidad, setCantidad] = useState(1);

    // Cargar los artículos y sucursales cuando el componente se monta
    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const data = await getArticulos(); // Obtener los artículos del backend
                setArticulos(data.Items);  // Asumiendo que los artículos se devuelven en un array dentro de "Items"
            } catch (error) {
                console.error("Error al obtener los artículos:", error);
            }
        };

        const fetchSucursales = async () => {
            try {
                const data = await getSucursales();  // Obtener las sucursales
                setSucursales(data);
            } catch (error) {
                console.error("Error al obtener las sucursales:", error);
            }
        };

        fetchArticulos();
        fetchSucursales();
    }, []);

    // Maneja el cambio de valor de los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja el cambio de la cantidad
    const handleCantidadChange = (e) => {
        setCantidad(e.target.value);
    };

    // Maneja la selección de un artículo
    const handleArticuloChange = (e) => {
        setSelectedArticulo(e.target.value);
    };

    // Maneja el cambio de la sucursal seleccionada
    const handleSucursalChange = async (e) => {
        setSelectedSucursal(e.target.value);
        // Cuando cambia la sucursal, obtener los vendedores de esa sucursal
        try {
            const data = await getVendedoresBySucursal(e.target.value); // Obtener vendedores por sucursal
            setVendedores(data);
            setSelectedVendedor(''); // Limpiar el vendedor seleccionado
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    // Maneja la selección del vendedor
    const handleVendedorChange = (e) => {
        setSelectedVendedor(e.target.value);
    };

    // Validar CUIL y Legajo
    const validateCuilAndLeg = async () => {
        const client = await getClientByCuil(formData.cliente_cuil);
        const vendedor = await getVendedorByLeg(formData.vendedor_leg);

        if (!client) {
            setMensaje('El CUIL ingresado no existe.');
            setTipoMensaje('danger');
            return false; // CUIL inválido
        }

        if (!vendedor) {
            setMensaje('El legajo ingresado no existe.');
            setTipoMensaje('danger');
            return false; // Legajo inválido
        }

        setMensaje(''); // Limpiar mensaje si todo es válido
        return true; // Ambos son válidos
    };

    // Validación del formulario antes de enviar
    const validateForm = () => {
        const { cliente_cuil, fecha_venta } = formData;

        // Validar CUIL
        if (cliente_cuil.length < 10) {
            setMensaje('El CUIL debe tener al menos 10 dígitos.');
            setTipoMensaje('danger');
            return false;
        }

        // Validar fecha de venta
        const fechaActual = new Date();  // Fecha actual
        const fechaLimite = new Date();  // Fecha limite (2 días antes de la actual)
        fechaLimite.setDate(fechaLimite.getDate() - 2);  // Restamos 2 días

        const fechaVenta = new Date(fecha_venta);  // La fecha que se ingresa en el formulario

        // Validar que la fecha esté entre la fecha actual y 2 días atrás
        if (fechaVenta > fechaActual || fechaVenta < fechaLimite) {
            setMensaje('La fecha de venta ingresada debe estar entre la fecha actual y hasta dos días atrás.');
            setTipoMensaje('danger');
            return false;
        }


        setMensaje(''); // Limpiar mensaje si todo es válido
        return true; // Formulario válido
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar el formulario
        const isValidForm = validateForm();
        if (!isValidForm) {
            return; // No continuar si el formulario es inválido
        }

        // Validar CUIL y Legajo
        const isValid = await validateCuilAndLeg();
        if (!isValid) {
            return; // No continuar si hay errores de validación
        }

        const ventaData = {
            cliente_cuil: formData.cliente_cuil,
            vendedor_leg: selectedVendedor, // Usar el vendedor seleccionado
            fecha_venta: formData.fecha_venta,
            nom_sucursal: selectedSucursal, // Usar la sucursal seleccionada
            detalles: formData.detalles,  // Array de artículos con cantidades
        };
        
        try {
            await saveSale(ventaData); // Llamada al backend para guardar la venta
            setMensaje('Venta registrada con éxito');
            setTipoMensaje('success');
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            setMensaje('Error al registrar la venta');
            setTipoMensaje('danger');
        }
    };

    // Agregar el artículo seleccionado al carrito de detalles
    const handleAddArticulo = () => {
        if (selectedArticulo && cantidad > 0) {
            const articulo = articulos.find((art) => art.id_articulo === parseInt(selectedArticulo));
            const detalle = { 
                id_articulo: articulo.id_articulo, 
                cantidad: cantidad 
            };
            setFormData({
                ...formData,
                detalles: [...formData.detalles, detalle]
            });
            setSelectedArticulo(''); // Limpiar la selección
            setCantidad(1); // Resetear la cantidad
        }
    };

    return (
        <div>
            <Aviso mensaje={mensaje} tipo={tipoMensaje} />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">CUIL del Cliente</label>
                    <input
                        type="text"
                        name="cliente_cuil"
                        className="form-control"
                        value={formData.cliente_cuil}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Sección de sucursal */}
                <div className="mb-3">
                    <label className="form-label">Sucursal</label>
                    <select
                        className="form-control"
                        value={selectedSucursal}
                        onChange={handleSucursalChange}
                        required
                    >
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                {sucursal.nombre_sucursal}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sección de vendedor */}
                <div className="mb-3">
                    <label className="form-label">Vendedor</label>
                    <select
                        className="form-control"
                        value={selectedVendedor}
                        onChange={handleVendedorChange}
                        required
                    >
                        <option value="">Seleccione un vendedor</option>
                        {vendedores.map(vendedor => (
                            <option key={vendedor.legajo} value={vendedor.legajo}>
                                {vendedor.nombre_vendedor} - {vendedor.especialidad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sección de fecha de venta */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Venta</label>
                    <input
                        type="date"
                        name="fecha_venta"
                        className="form-control"
                        value={formData.fecha_venta}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Sección de artículos */}
                <div className="mb-3">
                    <label className="form-label">Seleccione Artículo</label>
                    <select 
                        className="form-control"
                        value={selectedArticulo}
                        onChange={handleArticuloChange}
                    >
                        <option value="">Seleccione un artículo</option>
                        {articulos.map(articulo => (
                            <option key={articulo.id_articulo} value={articulo.id_articulo}>
                                {articulo.nombre_articulo} - ${articulo.precio}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sección de cantidad */}
                <div className="mb-3">
                    <label className="form-label">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        value={cantidad}
                        onChange={handleCantidadChange}
                        min="1"
                        required
                    />
                </div>

                <button type="button" className="btn btn-primary" onClick={handleAddArticulo}>
                    Agregar Artículo
                </button>

                <div className="mt-3">
                    <h5>Detalles de la Venta</h5>
                    <ul>
                        {formData.detalles.map((detalle, index) => {
                            const articulo = articulos.find(art => art.id_articulo === detalle.id_articulo);
                            return (
                                <li key={index}>{articulo?.nombre_articulo} x {detalle.cantidad}</li>
                            );
                        })}
                    </ul>
                </div>

                <button type="submit" className="btn btn-success">Guardar Venta</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => onSwitchView('list')}>Cancelar</button>
            </form>
        </div>
    );
}

export default SaleForm;