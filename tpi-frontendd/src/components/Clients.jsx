// Codigo de “Clients.jsx”

import React, { useState } from 'react';
import ClientsList from './ClientsList';
import ClientForm from './ClientForm';

function Clients() {
    const [view, setView] = useState('list');
    const [selectedClient, setSelectedClient] = useState(null);

    const switchView = (newView, client = null) => {
        setView(newView);
        setSelectedClient(client);
    };

    return (
        <div>
            <h1>Gestión de Clientes</h1>
            {view === 'list' && <ClientsList onSwitchView={switchView} />}
            {view === 'form' && <ClientForm client={selectedClient} onSwitchView={switchView} />}
        </div>
    );
}

export default Clients;