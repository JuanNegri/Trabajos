const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

// Obtener todos los artículos con filtros y paginación
router.get("/", async (req, res) => {
    try {
        let where = { activo: true }; // Filtrar artículos activos
        if (req.query.nombre) {
            where.nombre_articulo = {
                [Op.like]: `%${req.query.nombre}%`
            };
        }
        const pagina = parseInt(req.query.pagina) || 1;
        const tamañoPagina = 10;

        const { count, rows } = await db.articulos.findAndCountAll({
            attributes: ["id_articulo", "nombre_articulo", "precio", "activo"],
            order: [["nombre_articulo", "ASC"]],
            where,
            offset: (pagina - 1) * tamañoPagina,
            limit: tamañoPagina,
        });

        res.json({
            Items: rows,
            RegistrosTotal: count
        });
    } catch (err) {
        console.error("Error al obtener artículos:", err);
        res.status(500).json({
            message: "¡Algo salió mal! Error interno del servidor",
            error: err.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    const id_articulo = req.params.id;
    console.log(`Recibiendo solicitud DELETE para el artículo con ID: ${id_articulo}`);

    try {
        const result = await db.articulos.update(
            { activo: false }, // Marcar como inactivo
            { where: { id_articulo: id_articulo } }
        );

        console.log("Resultado de la actualización:", result); // Agregar depuración

        if (result[0] === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }

        res.status(204).send(); // Eliminación lógica exitosa
    } catch (err) {
        console.error("Error al eliminar el artículo:", err);
        res.status(500).json({
            message: "Error al eliminar el artículo",
            error: err.message,
        });
    }
});

// Crear un nuevo artículo
router.post("/", async (req, res) => {
    try {
        const { nombre_articulo, precio } = req.body;

        // Verificar si el artículo ya existe
        const existingArticle = await db.articulos.findOne({
            where: { nombre_articulo: nombre_articulo }
        });

        if (existingArticle) {
            return res.status(400).json({ message: "Este artículo ya existe" });
        }

        // Si no existe, crear el nuevo artículo
        const data = await db.articulos.create({
            nombre_articulo,
            precio,
            activo: true // Todos los nuevos artículos están activos por defecto
        });

        res.status(201).json(data);
    } catch (err) {
        console.error("Error inesperado al crear el artículo:", err);
        res.status(500).json({
            message: "Error inesperado, intenta nuevamente",
            error: err.message
        });
    }
});

// Actualizar un artículo
router.put("/:id", async (req, res) => {
    try {
        const item = await db.articulos.findOne({
            where: { id_articulo: req.params.id }
        });

        if (!item) {
            return res.status(404).json({ message: "¡El artículo solicitado no existe!" });
        }

        const { nombre_articulo, precio } = req.body;

        if (!nombre_articulo || !precio) {
            return res.status(400).json({ message: "¡Faltan datos obligatorios!" });
        }

        await db.articulos.update(
            { nombre_articulo, precio }, // Los nuevos valores
            { where: { id_articulo: req.params.id } } // Condición de actualización
        );

        console.log(`Artículo actualizado con ID: ${req.params.id}`);
        res.status(204).send(); // Responder con estado 204 (sin contenido)
    } catch (err) {
        console.error("Error al actualizar el artículo:", err);
        if (err instanceof ValidationError) {
            const messages = err.errors.map((x) => `${x.path}: ${x.message}`);
            res.status(400).json({ message: messages });
        } else {
            res.status(500).json({
                message: "¡Ups! Algo salió mal, por favor intenta más tarde",
                error: err.message
            });
        }
    }
});

// Eliminar un artículo (baja lógica)
router.delete("/:id", async (req, res) => {
    const id_articulo = req.params.id;
    console.log(`Recibiendo solicitud DELETE para el artículo con ID: ${id_articulo}`);

    try {
        const result = await db.articulos.update(
            { activo: false }, // Marcar como inactivo
            { where: { id_articulo: id_articulo } }
        );

        if (result[0] === 0) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }

        res.status(204).send(); // Eliminación lógica exitosa
    } catch (err) {
        console.error("Error al eliminar el artículo:", err);
        res.status(500).json({
            message: "Error al eliminar el artículo",
            error: err.message,
        });
    }
});

module.exports = router;