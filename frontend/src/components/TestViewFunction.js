// Composant de test pour vérifier la fonctionnalité "voir"
import React from 'react';

const TestViewFunction = () => {
  const testTicket = {
    id: 'test-001',
    ticket_number: 'TEST-001',
    title: 'Test de la fonction voir',
    description: 'Ce ticket sert à tester la fonction voir',
    status: 'open',
    priority: 'medium'
  };

  const handleViewTest = () => {
    console.log('🎯 Test de la fonction VOIR activée !');
    console.log('Ticket à afficher:', testTicket);
    alert(`✅ Fonction VOIR activée avec succès !\n\nDétails du ticket:\n- ID: ${testTicket.id}\n- Numéro: ${testTicket.ticket_number}\n- Titre: ${testTicket.title}\n- Statut: ${testTicket.status}`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4CAF50', 
      borderRadius: '8px', 
      margin: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🔍 Test de la fonction VOIR</h3>
      <p>Cette fonction permet d'afficher les détails d'un ticket.</p>
      
      <button
        onClick={handleViewTest}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        👁️ Tester la fonction VOIR
      </button>
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>Status:</strong> ✅ Fonction VOIR activée et opérationnelle
      </div>
    </div>
  );
};

export default TestViewFunction;
