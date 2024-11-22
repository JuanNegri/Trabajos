// Codigo de “venta.router.js”

const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { ValidationError } = require("sequelize");

// Obtener todas las ventas
router.get("/", async (req, res) => {
    try {
        const { count, rows } = await db.ventas.findAndCountAll({
            attributes: ['nro_venta', 'cliente_cuil', 'vendedor_leg', 'fecha_venta', 'nom_sucursal'],
            order: [['fecha_venta', 'DESC']],
        });

        res.json({
            Items: rows,
            RegistrosTotal: count
        });
    } catch (err) {
        console.error("Error al obtener las ventas:", err);
        res.status(500).json({ message: "Error al obtener las ventas", error: err.message });
    }
});

// Obtener una venta con sus detalles
router.get("/:nro_venta", async (req, res) => {
    try {
        const venta = await db.ventas.findOne({
            where: { nro_venta: req.params.nro_venta },
            include: [
                {
                    model: db.detallePedido,
                    include: [
                        {
                            model: db.articulos,
                            attributes: ['nombre_articulo', 'precio']
                        }
                    ]
                },
                {
                    model: db.clientes,
                    attributes: ['nombre_cliente']
                },
                {
                    model: db.vendedores,
                    attributes: ['nombre_vendedor']
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.json(venta);
    } catch (err) {
        console.error("Error al obtener la venta:", err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Crear una nueva venta con sus detalles
router.post("/", async (req, res) => {
    try {
        const { cliente_cuil, vendedor_leg, fecha_venta, nom_sucursal, detalles } = req.body;

        if (!cliente_cuil || !vendedor_leg || !fecha_venta || !nom_sucursal || !detalles || detalles.length === 0) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        const formattedDate = new Date(fecha_venta).toISOString().split('T')[0]; // '2024-11-01'

        // Crear la venta
        const venta = await db.ventas.create({
            cliente_cuil,
            vendedor_leg,
            fecha_venta: formattedDate,
            nom_sucursal,
        });

        // Crear los detalles de la venta
        const detallesPromises = detalles.map(detalle => {
            return db.detallePedido.create({
                id_articulo: detalle.id_articulo,
                cantidad: detalle.cantidad,
                nroVenta: venta.nro_venta,  // Relacionar el detalle con la venta
            });
        });

        await Promise.all(detallesPromises);

        // Devolver la venta creada junto con los detalles
        res.status(201).json({ venta, detalles });
    } catch (err) {
        console.error("Error al registrar la venta:", err);
        res.status(500).json({ message: "Error al registrar la venta", error: err.message });
    }
});

module.exports = router;