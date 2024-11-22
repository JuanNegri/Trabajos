// Codigo de “Sale.jsx”

import React, { useState } from 'react';
import SalesList from './SalesList';
import SaleForm from './SaleForm';

function Sales() {
    const [view, setView] = useState('list');
    const [selectedSale, setSelectedSale] = useState(null);

    const switchView = (newView, sale = null) => {
        setView(newView);
        setSelectedSale(sale);
    };

    return (
        <div>
            <h1>Gestión de Ventas</h1>
            {view === 'list' && <SalesList onSwitchView={switchView} />}
            {view === 'form' && <SaleForm sale={selectedSale} onSwitchView={switchView} />}
        </div>
    );
}

export default Sales;