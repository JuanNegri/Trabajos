// Codigo de “NavBar.jsx”

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate(); // Hook para la navegación

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Eliminar el token del almacenamiento
        navigate('/login'); // Redirigir a la página de inicio de sesión
    };

    const isAuthenticated = !!localStorage.getItem('accessToken'); // Verificar si hay un token

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Gestión Ventas de Articulos</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/ventas">Ventas</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/clientes">Clientes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/articulos">Artículos</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;