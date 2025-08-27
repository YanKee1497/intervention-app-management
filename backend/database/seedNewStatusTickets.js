const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'intervention_app.db');

// Connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie.');
  }
});

// Vérifier les utilisateurs disponibles
function getUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log('Utilisateurs trouvés:', rows.length);
        resolve(rows);
      }
    });
  });
}

// Vérifier les services disponibles
function getServices() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM services', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log('Services trouvés:', rows.length);
        resolve(rows);
      }
    });
  });
}

// Créer des tickets avec les nouveaux statuts
async function seedTicketsWithNewStatus() {
  try {
    const users = await getUsers();
    const services = await getServices();
    
    if (users.length === 0 || services.length === 0) {
      console.log('Pas assez d\'utilisateurs ou de services pour créer des tickets');
      return;
    }

    const employees = users.filter(u => u.role === 'employee');
    const technicians = users.filter(u => u.role === 'technician');
    
    console.log('Employés trouvés:', employees.length);
    console.log('Techniciens trouvés:', technicians.length);

    // Tickets pour le nouveau workflow (avec les bons noms de colonnes)
    const ticketsWithNewStatus = [
      {
        ticket_number: 'TCK-001',
        title: 'Installation logiciel antivirus - URGENT',
        description: 'Installation et configuration du logiciel antivirus sur le poste de travail principal.',
        urgency: 'high',
        status: 'pending',
        service_id: services[0].id,
        employee_id: employees[0]?.id || users[0].id
      },
      {
        ticket_number: 'TCK-002',
        title: 'Réparation imprimante réseau',
        description: 'L\'imprimante du service comptabilité ne répond plus aux demandes d\'impression.',
        urgency: 'medium',
        status: 'assigned',
        service_id: services[1]?.id || services[0].id,
        employee_id: employees[1]?.id || users[1].id,
        technician_id: technicians[0]?.id
      },
      {
        ticket_number: 'TCK-003',
        title: 'Configuration accès VPN',
        description: 'Mise en place d\'un accès VPN pour le télétravail.',
        urgency: 'medium',
        status: 'on_hold',
        service_id: services[0].id,
        employee_id: employees[0]?.id || users[0].id,
        technician_id: technicians[0]?.id
      },
      {
        ticket_number: 'TCK-004',
        title: 'Mise à jour système Windows',
        description: 'Mise à jour de sécurité critique sur tous les postes.',
        urgency: 'high',
        status: 'in_progress',
        service_id: services[0].id,
        employee_id: employees[1]?.id || users[1].id,
        technician_id: technicians[1]?.id || technicians[0]?.id
      },
      {
        ticket_number: 'TCK-005',
        title: 'Formation bureautique',
        description: 'Formation sur les nouvelles fonctionnalités d\'Office 365.',
        urgency: 'low',
        status: 'resolved',
        service_id: services[2]?.id || services[0].id,
        employee_id: employees[0]?.id || users[0].id,
        technician_id: technicians[0]?.id
      },
      {
        ticket_number: 'TCK-006',
        title: 'Récupération données supprimées',
        description: 'Récupération de fichiers importants supprimés par erreur.',
        urgency: 'high',
        status: 'pending',
        service_id: services[1]?.id || services[0].id,
        employee_id: employees[1]?.id || users[1].id
      },
      {
        ticket_number: 'TCK-007',
        title: 'Problème connexion Wi-Fi',
        description: 'Connexion Wi-Fi instable dans la salle de réunion.',
        urgency: 'medium',
        status: 'assigned',
        service_id: services[0].id,
        employee_id: employees[0]?.id || users[0].id,
        technician_id: technicians[1]?.id || technicians[0]?.id
      },
      {
        ticket_number: 'TCK-008',
        title: 'Installation nouveau logiciel métier',
        description: 'Installation et formation sur le nouveau logiciel de gestion.',
        urgency: 'medium',
        status: 'on_hold',
        service_id: services[2]?.id || services[0].id,
        employee_id: employees[1]?.id || users[1].id,
        technician_id: technicians[0]?.id
      }
    ];

    // Supprimer les anciens tickets
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM tickets', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Anciens tickets supprimés');
          resolve();
        }
      });
    });

    // Insérer les nouveaux tickets
    const insertPromises = ticketsWithNewStatus.map(ticket => {
      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO tickets (
          ticket_number, title, description, urgency, status, service_id, employee_id, technician_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
        
        db.run(sql, [
          ticket.ticket_number,
          ticket.title,
          ticket.description,
          ticket.urgency,
          ticket.status,
          ticket.service_id,
          ticket.employee_id,
          ticket.technician_id || null
        ], function(err) {
          if (err) {
            console.error('Erreur lors de l\'insertion du ticket:', err);
            reject(err);
          } else {
            console.log(`✅ Ticket créé: ${ticket.title} (${ticket.status})`);
            resolve();
          }
        });
      });
    });

    await Promise.all(insertPromises);
    console.log('\n🎉 Tous les tickets avec les nouveaux statuts ont été créés !');

    // Afficher un résumé
    const statusCounts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT status, COUNT(*) as count 
        FROM tickets 
        GROUP BY status 
        ORDER BY 
          CASE status 
            WHEN 'pending' THEN 1
            WHEN 'assigned' THEN 2
            WHEN 'on_hold' THEN 3
            WHEN 'in_progress' THEN 4
            WHEN 'resolved' THEN 5
          END
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log('\n📊 Résumé des tickets par statut:');
    console.log('=====================================');
    statusCounts.forEach(row => {
      const emoji = {
        'pending': '🔴',
        'assigned': '🟣',
        'on_hold': '🟠',
        'in_progress': '🟡',
        'resolved': '🟢'
      };
      console.log(`${emoji[row.status]} ${row.status}: ${row.count} ticket(s)`);
    });

  } catch (error) {
    console.error('Erreur lors de la création des tickets:', error);
  }
}

// Lancer le seeding
seedTicketsWithNewStatus().then(() => {
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err.message);
    } else {
      console.log('\n✨ Base de données fermée correctement.');
    }
  });
});
