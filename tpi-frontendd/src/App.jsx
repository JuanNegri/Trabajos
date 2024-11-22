import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Asegúrate de importar Router, Routes y Route
import Navbar from './components/Navbar';
import Home from './components/Home';
import Sales from './components/Sales';
import Clients from './components/Clients';
import Products from './components/Products';
import SaleDetailsList from './components/SaleDetailsList'; // Componente que muestra los detalles de la venta

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ventas" element={<Sales />} />
                    <Route path="/clientes" element={<Clients />} />
                    <Route path="/articulos" element={<Products />} />
                    <Route path="/ventas/detalle/:nroVenta" element={<SaleDetailsList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;