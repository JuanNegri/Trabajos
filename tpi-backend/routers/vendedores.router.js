//Codigo de “vendedores.router.js””

const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { ValidationError } = require("sequelize");

router.post("/", async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body); // Agrega este log

    const { nombre_vendedor, especialidad, fecha_ingreso } = req.body;

    // Validación de datos faltantes
    if (!nombre_vendedor || !especialidad || !fecha_ingreso) {
        return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
    }

    try {
        const vendedor = await db.vendedores.create({
            nombre_vendedor,
            especialidad,
            fecha_ingreso,
        });

        res.status(201).json(vendedor);
    } catch (err) {
        if (err instanceof ValidationError) {
            const messages = err.errors.map((x) => `${x.path}: ${x.message}`);
            res.status(400).json({ message: messages });
        } else {
            console.error("Error al crear el vendedor:", err);
            res.status(500).json({ message: "Error interno del servidor", error: err.message });
        }
    }
});

// Obtener todos los vendedores
router.get("/", async (req, res) => {
    try {
        const { count, rows } = await db.vendedores.findAndCountAll({
            attributes: ['legajo', 'nombre_vendedor', 'especialidad', 'fecha_ingreso'],
            order: [['nombre_vendedor', 'ASC']],
        });
        
        res.json({
            Items: rows,
            RegistrosTotal: count
        });
    } catch (err) {
        console.error("Error al obtener los vendedores:", err);
        res.status(500).json({ message: "Error al obtener los vendedores", error: err.message });
    }
});

// Obtener un vendedor por legajo
router.get("/:legajo", async (req, res) => {
    try {
        const vendedor = await db.vendedores.findOne({
            attributes: ['legajo', 'nombre_vendedor', 'especialidad', 'fecha_ingreso'],
            where: { legajo: req.params.legajo },
        });

        if (!vendedor) {
            return res.status(404).json({ message: "Vendedor no encontrado" });
        }

        res.json(vendedor);
    } catch (err) {
        console.error("Error al obtener el vendedor:", err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Obtener vendedores por sucursal
router.get('/sucursal/:id_sucursal', async (req, res) => {
    try {
        const vendedores = await db.vendedores.findAll({
            where: { id_sucursal: req.params.id_sucursal }
        });
        res.json(vendedores);
    } catch (err) {
        console.error("Error al obtener vendedores:", err);
        res.status(500).json({ message: "Error al obtener los vendedores", error: err.message });
    }
});

// Crear un nuevo vendedor
router.post("/", async (req, res) => {
    try {
        const { nombre_vendedor, especialidad, fecha_ingreso } = req.body;

        if (!nombre_vendedor || !especialidad || !fecha_ingreso) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        const vendedor = await db.vendedores.create({
            nombre_vendedor,
            especialidad,
            fecha_ingreso,
        });

        res.status(201).json(vendedor);
    } catch (err) {
        if (err instanceof ValidationError) {
            const messages = err.errors.map((x) => `${x.path}: ${x.message}`);
            res.status(400).json({ message: messages });
        } else {
            console.error("Error al crear el vendedor:", err);
            res.status(500).json({ message: "Error interno del servidor", error: err.message });
        }
    }
});

// Actualizar un vendedor
router.put("/:legajo", async (req, res) => {
    try {
        const vendedor = await db.vendedores.findOne({
            where: { legajo: req.params.legajo }
        });

        if (!vendedor) {
            return res.status(404).json({ message: "¡El vendedor solicitado no existe!" });
        }

        const { nombre_vendedor, especialidad, fecha_ingreso } = req.body;

        if (!nombre_vendedor || !especialidad || !fecha_ingreso) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        await db.vendedores.update(
            { nombre_vendedor, especialidad, fecha_ingreso },
            { where: { legajo: req.params.legajo } }
        );

        res.status(204).send(); // Responder con estado 204 (sin contenido)
    } catch (err) {
        console.error("Error al actualizar el vendedor:", err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Eliminar un vendedor (baja lógica)
router.delete("/:legajo", async (req, res) => {
    try {
        const result = await db.vendedores.update(
            { activo: false }, // Marcamos como inactivo en lugar de eliminar físicamente
            { where: { legajo: req.params.legajo } }
        );

        if (result[0] === 0) {
            return res.status(404).json({ message: "Vendedor no encontrado" });
        }

        res.status(204).send(); // Si todo va bien, respondemos con un 204 (sin contenido)
    } catch (err) {
        console.error("Error al eliminar el vendedor:", err);
        res.status(500).json({ message: "Error al eliminar el vendedor", error: err.message });
    }
});

module.exports = router;