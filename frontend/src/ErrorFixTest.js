// Test pour vérifier les corrections d'erreurs
import React from 'react';
import TicketsTable from './components/TicketsTable';

const ErrorFixTest = () => {
  // Test avec des données potentiellement problématiques
  const testTickets = [
    {
      id: 1,
      ticket_number: 'TCK-001',
      title: 'Test ticket valide',
      status: 'pending',
      employee: { firstname: 'Test', lastname: 'User' }
    },
    null, // Ticket null
    {
      // Ticket sans id
      ticket_number: 'TCK-002',
      title: 'Ticket sans id',
      status: 'pending'
    },
    {
      id: 3,
      ticket_number: 'TCK-003',
      title: 'Autre ticket valide',
      status: 'assigned',
      employee: null // Employee null
    }
  ];

  const currentUser = {
    id: 1,
    firstname: 'Test',
    lastname: 'User',
    role: 'technician'
  };

  const handleTicketAction = (action, ticketId) => {
    console.log(`Action: ${action}, Ticket ID: ${ticketId}`);
  };

  const handleTicketClick = (ticket) => {
    console.log('Ticket cliqué:', ticket);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test de correction des erreurs</h2>
      <TicketsTable
        tickets={testTickets}
        onTicketAction={handleTicketAction}
        onTicketClick={handleTicketClick}
        currentUser={currentUser}
        filteredStatus="all"
        searchTerm=""
      />
    </div>
  );
};

export default ErrorFixTest;
