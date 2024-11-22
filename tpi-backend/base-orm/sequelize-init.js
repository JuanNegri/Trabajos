const { Sequelize, DataTypes } = require("sequelize");

// Conexión a SQLite
const sequelize = new Sequelize("sqlite:./data/pymes.db");

// Definición de modelos
const articulos = sequelize.define("articulos", {
    id_articulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_articulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    activo: { // Nueva columna
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Los artículos son activos por defecto
        allowNull: false,
    },
}, {
    timestamps: false
});

const clientes = sequelize.define("clientes", {
    cuil_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            isInt: true,
            len: {
                args: [10], // Al menos 10 dígitos
                msg: "El CUIL debe tener al menos 10 dígitos.",
            },
        },
    },
    nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^[a-zA-ZÀ-ÿ\s]+$/i,
                msg: "El nombre solo puede contener letras y espacios.",
            },
        },
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isMayorDe18(value) {
                const hoy = new Date();
                const fechaNacimiento = new Date(value);
                const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
                if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    edad--;
                }
                if (edad < 18) {
                    throw new Error("El cliente debe ser mayor de 18 años.");
                }
            },
        },
    },
}, {
    timestamps: false
});

const vendedores = sequelize.define("vendedores", {
    legajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_vendedor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false
});

const ventas = sequelize.define("ventas", {
    nro_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cliente_cuil: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vendedor_leg: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_venta: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nom_sucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});

const detallePedido = sequelize.define("detallePedido", {
    idDetallePedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_articulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nroVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false
});

// Crear la tabla de sucursales
const sucursales = sequelize.define("sucursales", {
    id_sucursal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_sucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});

// Definición de relaciones
ventas.belongsTo(clientes, { foreignKey: "cliente_cuil" });
ventas.belongsTo(vendedores, { foreignKey: "vendedor_leg" });
detallePedido.belongsTo(articulos, { foreignKey: "id_articulo" });
detallePedido.belongsTo(ventas, { foreignKey: "nroVenta" });
vendedores.belongsTo(sucursales, { foreignKey: "id_sucursal" });

// Sincronización de modelos y carga inicial de datos
sequelize.sync({ force: false })
    .then(async () => {
        console.log("Base de datos sincronizada.");
        // Inserción de datos iniciales para sucursales
        const sucursalesData = [
            { nombre_sucursal: "Sucursal 1" },
            { nombre_sucursal: "Sucursal 2" },
            { nombre_sucursal: "Sucursal 3" },
            { nombre_sucursal: "Sucursal 4" },
            { nombre_sucursal: "Sucursal 5" }
        ];
        
        const clientesData = [
            { cuil_cliente: 20304050607, nombre_cliente: "Juan Pérez", fecha_nacimiento: "1990-05-15" },
            { cuil_cliente: 20446548227, nombre_cliente: "Jose Gonzalez", fecha_nacimiento: "2001-09-25" },
            { cuil_cliente: 20058549653, nombre_cliente: 'Martin Diaz', fecha_nacimiento: '1990-05-15' },
            { cuil_cliente: 21456987254, nombre_cliente: 'Joaquin Martínez', fecha_nacimiento: '2004-05-30' },
            { cuil_cliente: 22356582159, nombre_cliente: 'Jennifer Aguirre', fecha_nacimiento: '1995-07-09' },
            { cuil_cliente: 20215468261, nombre_cliente: 'Maria Esperanza Cuenca', fecha_nacimiento: '1975-11-14' },
            { cuil_cliente: 20335462568, nombre_cliente: 'Alfonso Cantos', fecha_nacimiento: '1985-12-10' },
            { cuil_cliente: 20435768527, nombre_cliente: 'Mariano Romero', fecha_nacimiento: '2002-02-18' },
            { cuil_cliente: 21123545762, nombre_cliente: 'Eusebio Tome', fecha_nacimiento: '1958-04-24' },
            { cuil_cliente: 20405768216, nombre_cliente: 'Melania Amaya', fecha_nacimiento: '2000-06-08' },
            { cuil_cliente: 20385462195, nombre_cliente: 'Alejandro Mateos', fecha_nacimiento: '1990-10-04' }
        ];
        
        const vendedoresData = [
            { nombre_vendedor: "Carlos Pérez", especialidad: "Electrónica", fecha_ingreso: "2020-01-10", id_sucursal: 1 },
            { nombre_vendedor: "Ana Martínez", especialidad: "Hogar", fecha_ingreso: "2019-05-15", id_sucursal: 1 },
            { nombre_vendedor: "Luis Gómez", especialidad: "Juguetería", fecha_ingreso: "2021-03-12", id_sucursal: 1 },
        
            { nombre_vendedor: "José Rodríguez", especialidad: "Electrónica", fecha_ingreso: "2020-07-21", id_sucursal: 2 },
            { nombre_vendedor: "Marta Sánchez", especialidad: "Ropa", fecha_ingreso: "2018-11-30", id_sucursal: 2 },
            { nombre_vendedor: "Juan López", especialidad: "Hogar", fecha_ingreso: "2022-01-17", id_sucursal: 2 },
        
            { nombre_vendedor: "Sofía Pérez", especialidad: "Cosméticos", fecha_ingreso: "2019-04-15", id_sucursal: 3 },
            { nombre_vendedor: "Raúl Díaz", especialidad: "Tecnología", fecha_ingreso: "2020-05-03", id_sucursal: 3 },
            { nombre_vendedor: "Isabel Martínez", especialidad: "Ropa", fecha_ingreso: "2017-09-19", id_sucursal: 3 },
        
            { nombre_vendedor: "Pablo Fernández", especialidad: "Juguetería", fecha_ingreso: "2021-02-25", id_sucursal: 4 },
            { nombre_vendedor: "Carla Gómez", especialidad: "Electrónica", fecha_ingreso: "2020-10-12", id_sucursal: 4 },
            { nombre_vendedor: "Diego Castro", especialidad: "Hogar", fecha_ingreso: "2022-07-08", id_sucursal: 4 },
        
            { nombre_vendedor: "Laura Martínez", especialidad: "Deportes", fecha_ingreso: "2021-06-19", id_sucursal: 5 },
            { nombre_vendedor: "Pedro Sánchez", especialidad: "Hogar", fecha_ingreso: "2019-11-05", id_sucursal: 5 },
            { nombre_vendedor: "Eva Ruiz", especialidad: "Electrónica", fecha_ingreso: "2020-08-22", id_sucursal: 5 }
        ];
        
        
        const articulosData = [
            { nombre_articulo: "Pañales", precio: 100.50, activo: true },
            { nombre_articulo: "Galletas", precio: 50.00, activo: true },
            { nombre_articulo: "Cigarrillos", precio: 150.00, activo: true },
            { nombre_articulo: "Libreta", precio: 500.00, activo: true },
            { nombre_articulo: "Reloj", precio: 580.00, activo: true },
            { nombre_articulo: "Lapiz", precio: 25.00, activo: true },
            { nombre_articulo: "Jarron", precio: 80.00, activo: true },
            { nombre_articulo: "Almohada", precio: 120.00, activo: true },
        ];
        
        const ventasData = [
            { cliente_cuil: 20304050607, vendedor_leg: 1, fecha_venta: "2023-03-15", nom_sucursal: "1" },
            { cliente_cuil: 20446548227, vendedor_leg: 2, fecha_venta: "2023-03-20", nom_sucursal: "2" }
        ];
        
        const detallePedidoData = [
            { id_articulo: 1, cantidad: 2, nroVenta: 1 },
            { id_articulo: 2, cantidad: 5, nroVenta: 1 },
            { id_articulo: 1, cantidad: 3, nroVenta: 2 },
            { id_articulo: 2, cantidad: 1, nroVenta: 2 }
        ];

        try {
            // Inserción de datos iniciales
            await sequelize.models.sucursales.bulkCreate(sucursalesData, { ignoreDuplicates: true });
            await sequelize.models.clientes.bulkCreate(clientesData, { ignoreDuplicates: true });
            await sequelize.models.vendedores.bulkCreate(vendedoresData, { ignoreDuplicates: true });
            await sequelize.models.articulos.bulkCreate(articulosData, { ignoreDuplicates: true });
            await sequelize.models.ventas.bulkCreate(ventasData, { ignoreDuplicates: true });
            await sequelize.models.detallePedido.bulkCreate(detallePedidoData, { ignoreDuplicates: true });

            console.log("Datos iniciales cargados correctamente.");
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error.message);
        }
    })
    .catch((err) => console.error("Error al sincronizar:", err.message));

module.exports = {
    sequelize,
    articulos,
    clientes,
    vendedores,
    ventas,
    detallePedido,
    sucursales,
};