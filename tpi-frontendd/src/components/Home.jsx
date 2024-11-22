// Codigo de “Home.jsx”

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="text-center">
            <h1>Bienvenido a la Gestión de PYMES</h1>
            <p>Utiliza el menú para navegar a las diferentes secciones:</p>
            <div className="d-flex justify-content-center gap-3">
                <Link to="/ventas" className="btn btn-primary">Ventas</Link>
                <Link to="/clientes" className="btn btn-secondary">Clientes</Link>
                <Link to="/articulos" className="btn btn-success">Artículos</Link>
            </div>
        </div>
    );
}

export default Home;