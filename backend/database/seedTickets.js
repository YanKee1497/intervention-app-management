const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const createTestTickets = async () => {
  const db = new sqlite3.Database(dbPath);
  
  try {
    console.log('🎫 Création des tickets de test...');
    
    // D'abord, créer quelques services
    const servicesData = [
      { name: 'Informatique', description: 'Support technique et matériel informatique', icon: '💻' },
      { name: 'Maintenance', description: 'Maintenance des équipements et locaux', icon: '🔧' },
      { name: 'Nettoyage', description: 'Entretien et nettoyage des locaux', icon: '🧹' }
    ];

    for (const service of servicesData) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO services (name, description, icon) VALUES (?, ?, ?)',
          [service.name, service.description, service.icon],
          (err) => err ? reject(err) : resolve()
        );
      });
    }

    // Créer des tickets avec différents statuts
    const ticketsData = [
      {
        ticket_number: 'TKT-001',
        title: 'Écran qui ne s\'allume plus',
        description: 'Mon écran principal ne s\'allume plus depuis ce matin',
        urgency: 'high',
        status: 'pending',
        service_id: 1,
        employee_id: 5
      },
      {
        ticket_number: 'TKT-002',
        title: 'Imprimante bloquée',
        description: 'L\'imprimante du bureau 204 a un bourrage papier',
        urgency: 'medium',
        status: 'assigned',
        service_id: 1,
        employee_id: 6,
        technician_id: 3
      },
      {
        ticket_number: 'TKT-003',
        title: 'Climatisation en panne',
        description: 'La climatisation de la salle de réunion ne fonctionne plus',
        urgency: 'high',
        status: 'in_progress',
        service_id: 2,
        employee_id: 5,
        technician_id: 4
      },
      {
        ticket_number: 'TKT-004',
        title: 'Nettoyage spécialisé',
        description: 'Nettoyage après travaux dans le bureau 301',
        urgency: 'low',
        status: 'on_hold',
        service_id: 3,
        employee_id: 6,
        technician_id: 3
      },
      {
        ticket_number: 'TKT-005',
        title: 'Installation logiciel',
        description: 'Installation d\'un nouveau logiciel de comptabilité',
        urgency: 'medium',
        status: 'resolved',
        service_id: 1,
        employee_id: 5,
        technician_id: 4
      },
      {
        ticket_number: 'TKT-006',
        title: 'Réparation porte',
        description: 'La porte du bureau 105 ne ferme plus correctement',
        urgency: 'critical',
        status: 'pending',
        service_id: 2,
        employee_id: 6
      }
    ];

    for (const ticket of ticketsData) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO tickets 
           (ticket_number, title, description, urgency, status, service_id, employee_id, technician_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ticket.ticket_number,
            ticket.title,
            ticket.description,
            ticket.urgency,
            ticket.status,
            ticket.service_id,
            ticket.employee_id,
            ticket.technician_id || null
          ],
          (err) => err ? reject(err) : resolve()
        );
      });
    }

    console.log('✅ Tickets de test créés avec succès !');
    console.log('📊 Statuts créés :');
    console.log('   🔴 1 ticket pending (TKT-001, TKT-006)');
    console.log('   🟣 1 ticket assigned (TKT-002)');
    console.log('   🟡 1 ticket in_progress (TKT-003)');
    console.log('   🟠 1 ticket on_hold (TKT-004)');
    console.log('   🟢 1 ticket resolved (TKT-005)');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des tickets:', error);
  } finally {
    db.close();
  }
};

if (require.main === module) {
  createTestTickets();
}

module.exports = { createTestTickets };
