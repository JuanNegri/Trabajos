// Codigo de “detallepedido.router.js””

const express = require('express');
const router = express.Router();
const db = require('../base-orm/sequelize-init');

router.get('/', async (req, res) => {
    try {
        const detalles = await db.detallePedido.findAll({
            include: [
                {
                    model: db.articulos,
                    attributes: ['nombre_articulo', 'precio']
                },
                {
                    model: db.ventas,
                    attributes: ['fecha_venta', 'nom_sucursal']
                },
            ],
        });

        res.json(detalles);
    } catch (err) {
        console.error("Error al obtener los detalles:", err);
        res.status(500).json({ message: "Error interno del servidor.", error: err.message });
    }
});


router.get('/:nroVenta', async (req, res) => {
    try {
        const detalles = await db.detallePedido.findAll({
            where: { nroVenta: req.params.nroVenta },
            include: [
                {
                    model: db.articulos,
                    attributes: ['nombre_articulo', 'precio']
                },
                {
                    model: db.ventas,
                    attributes: ['fecha_venta', 'nom_sucursal'],
                    include: [
                        {
                            model: db.vendedores,
                            attributes: ['nombre_vendedor']
                        }
                    ]
                },
            ],
        });

        if (!detalles.length) {
            return res.status(404).json({ message: "No se encontraron detalles para esta venta." });
        }

        res.json(detalles);
    } catch (err) {
        console.error("Error al obtener los detalles del pedido:", err);
        res.status(500).json({ message: "Error al obtener los detalles del pedido.", error: err.message });
    }
});

// Crear un nuevo detalle de pedido
router.post('/', async (req, res) => {
    try {
        const { id_articulo, cantidad, nroVenta } = req.body;

        // Validar que los datos de req.body estén completos
        if (!id_articulo || !cantidad || !nroVenta) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        const detalle = await db.detallePedido.create({
            id_articulo,
            cantidad,
            nroVenta,
        });

        res.status(201).json(detalle);
    } catch (err) {
        console.error("Error al crear el detalle de pedido:", err);
        res.status(500).json({ message: "Error inesperado, intenta nuevamente", error: err.message });
    }
});


// Actualizar un detalle de pedido
router.put('/:id', async (req, res) => {
    try {
        const detalle = await db.detallePedido.findOne({
            where: { idDetallePedido: req.params.id }
        });

        if (!detalle) {
            return res.status(404).json({ message: "¡El detalle de pedido solicitado no existe!" });
        }

        const { id_articulo, cantidad, nroVenta } = req.body;

        if (!id_articulo || !cantidad || !nroVenta) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        await db.detallePedido.update(
            { id_articulo, cantidad, nroVenta },
            { where: { idDetallePedido: req.params.id } }
        );

        res.status(204).send(); // Responder con estado 204 (sin contenido)
    } catch (err) {
        console.error("Error al actualizar el detalle de pedido:", err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Eliminar un detalle de pedido (baja lógica)
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.detallePedido.update(
            { activo: false }, // Marcamos como inactivo en lugar de eliminar físicamente
            { where: { idDetallePedido: req.params.id } }
        );

        if (result[0] === 0) {
            return res.status(404).json({ message: "Detalle de pedido no encontrado" });
        }

        res.status(204).send(); // Si todo va bien, respondemos con un 204 (sin contenido)
    } catch (err) {
        console.error('Error al eliminar el detalle de pedido:', err);
        res.status(500).json({ message: "Error al eliminar el detalle de pedido", error: err.message });
    }
});

module.exports = router;