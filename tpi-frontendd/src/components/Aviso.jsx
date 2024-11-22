// Codigo de “Aviso.jsx”

import React from 'react';

const Aviso = ({ mensaje, tipo }) => {
    if (!mensaje) return null; // No mostrar nada si no hay mensaje

    return (
        <div className={`alert alert-${tipo}`} role="alert">
            {mensaje}
        </div>
    );
};

export default Aviso;