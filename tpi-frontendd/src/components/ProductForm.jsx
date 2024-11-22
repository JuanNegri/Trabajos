// Codigo de “ProductForm.jsx”

import React, { useState, useEffect } from 'react';
import { saveProduct } from '../services/productService';

function ProductForm({ product, onSwitchView }) {
    const [formData, setFormData] = useState({
        nombre_articulo: '',
        precio: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                nombre_articulo: product.nombre_articulo,
                precio: product.precio
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveProduct({ ...formData, id_articulo: product?.id_articulo });
            onSwitchView('list');
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            alert("Error al guardar el producto. Intenta nuevamente."); // Manejo básico de errores
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="nombre_articulo" className="form-label">Nombre del Artículo</label>
                <input
                    type="text"
                    className="form-control"
                    id="nombre_articulo"
                    name="nombre_articulo"
                    value={formData.nombre_articulo}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {product ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => onSwitchView('list')}>Cancelar</button>
        </form>
    );
}

export default ProductForm;