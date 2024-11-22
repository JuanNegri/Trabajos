// Codigo de “Products.jsx”

import React, { useState } from 'react';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';

function Products() {
    const [view, setView] = useState('list');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const switchView = (newView, product = null) => {
        setView(newView);
        setSelectedProduct(product);
    };

    return (
        <div>
            <h1>Gestión de Artículos</h1>
            {view === 'list' && <ProductsList onSwitchView={switchView} />}
            {view === 'form' && <ProductForm product={selectedProduct} onSwitchView={switchView} />}
        </div>
    );
}

export default Products;