const sqlite3 = require('sqlite3').verbose();

async function CrearBaseSiNoExiste() {
    const db = new sqlite3.Database('./data/pymes.db', (err) => {
        if (err) {
            console.error("Error al conectar con la base de datos:", err.message);
            return;
        }
        console.log("Conexión a la base de datos establecida.");
    });

    // Crear tablas si no existen
    db.serialize(() => {
        // Crear tabla sucursales
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'sucursales'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE sucursales (
                    id_sucursal INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre_sucursal TEXT NOT NULL
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla sucursales:", err.message);
                    else console.log("Tabla sucursales creada!");
                });
            }
        });

        // Crear tabla clientes
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'clientes'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE clientes (
                    cuil_cliente INTEGER PRIMARY KEY,
                    nombre_cliente CHAR NOT NULL,
                    fecha_nacimiento DATE NOT NULL
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla clientes:", err.message);
                    else console.log("Tabla clientes creada!");
                });
            }
        });

        // Crear tabla vendedores (agregando la columna id_sucursal)
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'vendedores'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE vendedores (
                    legajo INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre_vendedor TEXT NOT NULL,
                    especialidad TEXT NOT NULL,
                    fecha_ingreso DATE NOT NULL,
                    id_sucursal INTEGER,
                    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla vendedores:", err.message);
                    else console.log("Tabla vendedores creada!");
                });
            } else {
                // Si la tabla ya existe, la eliminamos y la volvemos a crear con la columna 'id_sucursal'
                db.run("DROP TABLE vendedores;", (err) => {
                    if (err) console.error("Error al eliminar la tabla vendedores:", err.message);
                    else {
                        console.log("Tabla vendedores eliminada!");
                        db.run(`CREATE TABLE vendedores (
                            legajo INTEGER PRIMARY KEY AUTOINCREMENT,
                            nombre_vendedor TEXT NOT NULL,
                            especialidad TEXT NOT NULL,
                            fecha_ingreso DATE NOT NULL,
                            id_sucursal INTEGER,
                            FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
                        );`, (err) => {
                            if (err) console.error("Error al crear la tabla vendedores:", err.message);
                            else console.log("Tabla vendedores recreada con la columna 'id_sucursal'!");
                        });
                    }
                });
            }
        });

        // Crear tabla articulos
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'articulos'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE articulos (
                    id_articulo INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre_articulo CHAR NOT NULL,
                    precio DECIMAL(10, 2) NOT NULL,
                    activo BOOLEAN DEFAULT TRUE NOT NULL
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla articulos:", err.message);
                    else console.log("Tabla articulos creada!");
                });
            }
        });

        // Crear tabla ventas
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'ventas'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE ventas (
                    nro_venta INTEGER PRIMARY KEY AUTOINCREMENT,
                    cliente_cuil INTEGER NOT NULL,
                    vendedor_leg INTEGER NOT NULL,
                    fecha_venta DATE NOT NULL,
                    nom_sucursal STRING NOT NULL,
                    FOREIGN KEY (cliente_cuil) REFERENCES clientes(cuil_cliente),
                    FOREIGN KEY (vendedor_leg) REFERENCES vendedores(legajo)
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla ventas:", err.message);
                    else console.log("Tabla ventas creada!");
                });
            }
        });

        // Crear tabla detallePedido
        db.get("SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' AND name = 'detallePedido'", [], (err, row) => {
            if (err) {
                console.error(err.message);
            }
            if (row.contar === 0) {
                db.run(`CREATE TABLE detallePedido (
                    idDetallePedido INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_articulo INTEGER NOT NULL,
                    cantidad INTEGER NOT NULL,
                    nroVenta INTEGER NOT NULL,
                    FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo),
                    FOREIGN KEY (nroVenta) REFERENCES ventas(nro_venta)
                );`, (err) => {
                    if (err) console.error("Error al crear la tabla detallePedido:", err.message);
                    else console.log("Tabla detallePedido creada!");
                });
            }
        });

        // Insertar datos iniciales en la tabla sucursales
        db.run(`INSERT INTO sucursales (nombre_sucursal) VALUES
            ('Sucursal 1'),
            ('Sucursal 2'),
            ('Sucursal 3'),
            ('Sucursal 4'),
            ('Sucursal 5');`);

        // Insertar datos iniciales en la tabla clientes
        db.run(`INSERT INTO clientes (cuil_cliente, nombre_cliente, fecha_nacimiento) VALUES
            (20304050607, 'Juan Pérez', '1990-05-15'),
            (20058549653, 'Martin Diaz', '1990-05-15'),
            (20446548227, 'Jose Gonzalez', '2001-09-25');`);

        // Insertar datos iniciales en la tabla vendedores
        db.run(`INSERT INTO vendedores (nombre_vendedor, especialidad, fecha_ingreso, id_sucursal) VALUES
            ('Carlos Pérez', 'Electrónica', '2020-01-10', 1),
            ('Ana Martínez', 'Hogar', '2019-05-15', 2);`);

        // Insertar datos iniciales en la tabla articulos
        db.run(`INSERT INTO articulos (nombre_articulo, precio, activo) VALUES
            ('Pañales', 100.50, 1),
            ('Galletas', 50.00, 1),
            ('Cigarrillos', 150.00, 1);`);
    });

    db.close();
}

CrearBaseSiNoExiste();
module.exports = CrearBaseSiNoExiste;