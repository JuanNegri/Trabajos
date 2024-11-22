const express = require('express');
const cors = require('cors');
const ventasRouter = require('./routers/venta.router'); // Importar el router de ventas
const clientesRouter = require('./routers/cliente.router'); // Importar el router de clientes
const vendedoresRouter = require('./routers/vendedores.router'); // Importar el router de vendedores
const articulosRouter = require('./routers/articulos.router'); // Importar el router de artículos
const { sequelize } = require('./base-orm/sequelize-init'); // Importar tu instancia de Sequelize
const detallePedidoRouter = require('./routers/detallepedido.router');
const sucursalesRouter = require('./routers/sucursal.router'); // Cambiar el nombre aquí

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esto según tu configuración
  credentials: true,
}));

app.use(express.json()); // Habilitar el análisis de JSON

// Rutas
app.use('/api/ventas', ventasRouter); // Usar el router de ventas
app.use('/api/clientes', clientesRouter); // Usar el router de clientes
app.use('/api/vendedores', vendedoresRouter); // Usar el router de vendedores
app.use('/api/articulos', articulosRouter); // Usar el router de artículos
app.use('/api/detallepedido', detallePedidoRouter);
app.use('/api/sucursales', sucursalesRouter); // Cambiar el nombre aquí

// Ruta principal
app.get('/', (req, res) => {
  res.send('Backend en ejecución.');
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false }) // Cambia a true solo si deseas reiniciar la base de datos
  .then(() => {
    console.log("Base de datos sincronizada.");
    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en puerto ${port}`);
    });
  })
  .catch(err => {
    console.error("Error al sincronizar la base de datos:", err.message);
  });