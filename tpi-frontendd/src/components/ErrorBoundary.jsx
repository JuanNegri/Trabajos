// Codigo de “ErrorBoundary.jsx”

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente renderizado muestre la interfaz de error
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Puedes registrar el error en un servicio de reporte de errores
        console.error("Error capturado:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Algo salió mal. Por favor, intenta nuevamente.</h1>;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;