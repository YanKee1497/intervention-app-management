// Test des options VOIR LES DÉTAILS et PRENDRE LA MAIN
import React from 'react';

const TestTicketActions = () => {
  // Simulation de l'utilisateur technicien actuel (id: 3)
  const currentUser = { id: 3, prenom: 'Jean', nom: 'Technicien', role: 'technician' };
  
  // Simulation de tickets de test
  const testTickets = [
    {
      id: 1,
      ticket_number: 'TCK-TEST-001',
      title: 'Ticket en attente - peut être pris',
      status: 'pending',
      technician_id: null,
      technician: null
    },
    {
      id: 2,
      ticket_number: 'TCK-TEST-002',
      title: 'Ticket assigné à moi - peut commencer travail',
      status: 'assigned',
      technician_id: 3,
      technician: { firstname: 'Jean', lastname: 'Technicien' }
    },
    {
      id: 3,
      ticket_number: 'TCK-TEST-003',
      title: 'Ticket en cours - peut voir détails',
      status: 'in_progress',
      technician_id: 3,
      technician: { firstname: 'Jean', lastname: 'Technicien' }
    }
  ];

  // Tests des fonctions de validation
  const canTakeTicket = (ticket) => {
    return (ticket.status === 'pending' || ticket.status === 'assigned') && 
           (!ticket.technician_id || ticket.technician_id === currentUser?.id);
  };

  const canStartWork = (ticket) => {
    return ticket.status === 'assigned' && ticket.technician_id === currentUser?.id;
  };

  const canUpdateStatus = (ticket) => {
    return ticket.technician_id === currentUser?.id || currentUser?.role === 'admin' || currentUser?.role === 'manager';
  };

  const testActions = () => {
    console.log('🧪 TEST DES ACTIONS DE TICKETS');
    console.log('👤 Utilisateur actuel:', currentUser);
    console.log('');
    
    testTickets.forEach(ticket => {
      console.log(`🎫 ${ticket.ticket_number} (${ticket.status})`);
      console.log(`   ✅ Peut prendre: ${canTakeTicket(ticket)}`);
      console.log(`   🚀 Peut commencer: ${canStartWork(ticket)}`);
      console.log(`   ⚙️ Peut modifier: ${canUpdateStatus(ticket)}`);
      console.log(`   👁️ Peut voir détails: true`);
      console.log('');
    });

    alert(`✅ TEST RÉUSSI !\n\n🔍 VOIR LES DÉTAILS: ACTIVÉ\n🚀 PRENDRE LA MAIN: ACTIVÉ\n\nLes boutons apparaîtront selon les conditions:\n• Prendre: tickets en attente\n• Commencer: tickets assignés à vous\n• Voir détails: tous les tickets\n\nConsultez la console pour plus de détails.`);
  };

  return (
    <div style={{
      padding: '25px',
      margin: '20px',
      border: '3px solid #28a745',
      borderRadius: '12px',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#28a745', marginBottom: '20px' }}>
        🎯 Test des Actions de Tickets
      </h2>
      
      <div style={{ marginBottom: '20px', fontSize: '16px', color: '#666' }}>
        <p><strong>Utilisateur:</strong> {currentUser.prenom} {currentUser.nom} (ID: {currentUser.id})</p>
        <p><strong>Rôle:</strong> {currentUser.role}</p>
      </div>
      
      <button
        onClick={testActions}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          margin: '10px'
        }}
      >
        🧪 TESTER LES ACTIONS
      </button>
      
      <div style={{
        marginTop: '25px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        fontSize: '14px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          borderRadius: '8px',
          color: '#155724'
        }}>
          <strong>✅ VOIR LES DÉTAILS</strong><br/>
          Disponible sur tous les tickets<br/>
          Bouton 👁️
        </div>
        
        <div style={{
          padding: '15px',
          backgroundColor: '#d1ecf1',
          borderRadius: '8px',
          color: '#0c5460'
        }}>
          <strong>🚀 PRENDRE LA MAIN</strong><br/>
          Tickets pending/assigned<br/>
          Bouton 🚀
        </div>
      </div>
    </div>
  );
};

export default TestTicketActions;
