const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init"); // Asegúrate de que la ruta sea correcta
const { ValidationError } = require("sequelize");

// Obtener todos los clientes con paginación
router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10; // Si no se pasa limit, por defecto será 10
    const offset = parseInt(req.query.offset, 10) || 0; // Si no se pasa offset, por defecto será 0

    try {
        const { count, rows } = await db.clientes.findAndCountAll({
            attributes: ["cuil_cliente", "nombre_cliente", "fecha_nacimiento"],
            order: [["nombre_cliente", "ASC"]], // Ordenar por nombre del cliente
            limit: limit, // Establecer límite
            offset: offset, // Establecer desplazamiento
        });

        res.json({
            Items: rows,
            RegistrosTotal: count
        });
    } catch (err) {
        console.error("Error al obtener los clientes:", err);
        res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
    }
});

// Obtener un cliente por CUIL
router.get("/:cuil", async (req, res) => {
    try {
        const cliente = await db.clientes.findOne({
            where: { cuil_cliente: req.params.cuil }
        });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (err) {
        console.error("Error al obtener el cliente:", err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Ruta para obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const allClientes = await clientes.findAll();
        res.json({
            Items: allClientes,
            RegistrosTotal: allClientes.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para crear un nuevo cliente
router.post('/', async (req, res) => {
    try {
        const nuevoCliente = await db.clientes.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ errores: ['El CUIL ingresado ya está registrado'] });
        }
        if (err.name === 'SequelizeValidationError') {
            const errores = err.errors.map((e) => e.message);
            return res.status(400).json({ errores });
        }
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Actualizar un cliente
router.put("/:cuil", async (req, res) => {
    try {
        const cliente = await db.clientes.findOne({
            where: { cuil_cliente: req.params.cuil }
        });

        if (!cliente) {
            return res.status(404).json({ message: "¡El cliente solicitado no existe!" });
        }

        const { nombre_cliente, fecha_nacimiento } = req.body;

        if (nombre_cliente) cliente.nombre_cliente = nombre_cliente;
        if (fecha_nacimiento) cliente.fecha_nacimiento = fecha_nacimiento;

        await cliente.save();
        res.json(cliente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Eliminar un cliente
router.delete("/:cuil", async (req, res) => {
    try {
        const cliente = await db.clientes.findOne({
            where: { cuil_cliente: req.params.cuil }
        });

        if (!cliente) {
            return res.status(404).json({ message: "¡El cliente solicitado no existe!" });
        }

        await cliente.destroy();
        res.status(204).send(); // No content
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
    }
});

// Exportar el router
module.exports = router;