const express = require('express');
const router = express.Router();
const db = require('../base-orm/sequelize-init'); // Asegúrate de que la ruta sea correcta

// Obtener todas las sucursales
router.get('/', async (req, res) => {
    try {
        const sucursales = await db.sucursales.findAll(); // Obtener todas las sucursales
        res.json(sucursales); // Responde con las sucursales
    } catch (err) {
        console.error("Error al obtener las sucursales:", err);
        res.status(500).json({ message: "Error al obtener las sucursales", error: err.message });
    }
});

// Crear una nueva sucursal
router.post('/', async (req, res) => {
    const { nombre_sucursal } = req.body;
    try {
        const nuevaSucursal = await db.sucursales.create({ nombre_sucursal });
        res.status(201).json(nuevaSucursal); // Responde con la sucursal recién creada
    } catch (err) {
        console.error("Error al crear la sucursal:", err);
        res.status(500).json({ message: "Error al crear la sucursal", error: err.message });
    }
});

module.exports = router;
