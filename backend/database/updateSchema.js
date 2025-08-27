const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'intervention_app.db');

const updateSchema = () => {
  const db = new sqlite3.Database(dbPath);

  console.log('🔄 Mise à jour du schéma de la base de données...');

  // Ajouter le nouveau statut 'on_hold' aux contraintes de statut
  db.run(`
    DROP TABLE IF EXISTS tickets_new;
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression de la table temporaire:', err);
      return;
    }

    // Créer une nouvelle table avec les nouveaux statuts
    db.run(`
      CREATE TABLE tickets_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        urgency TEXT NOT NULL CHECK(urgency IN ('low', 'medium', 'high', 'critical')),
        status TEXT NOT NULL CHECK(status IN ('pending', 'assigned', 'in_progress', 'on_hold', 'resolved', 'rejected')) DEFAULT 'pending',
        service_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        technician_id INTEGER,
        attachment_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (service_id) REFERENCES services (id),
        FOREIGN KEY (employee_id) REFERENCES users (id),
        FOREIGN KEY (technician_id) REFERENCES users (id)
      );
    `, (err) => {
      if (err) {
        console.error('Erreur lors de la création de la nouvelle table:', err);
        return;
      }

      // Copier les données de l'ancienne table
      db.run(`
        INSERT INTO tickets_new 
        SELECT * FROM tickets;
      `, (err) => {
        if (err) {
          console.error('Erreur lors de la copie des données:', err);
          return;
        }

        // Supprimer l'ancienne table
        db.run(`DROP TABLE tickets;`, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de l\'ancienne table:', err);
            return;
          }

          // Renommer la nouvelle table
          db.run(`ALTER TABLE tickets_new RENAME TO tickets;`, (err) => {
            if (err) {
              console.error('Erreur lors du renommage:', err);
              return;
            }

            console.log('✅ Schéma mis à jour avec succès !');
            console.log('Nouveaux statuts disponibles:');
            console.log('🔴 pending - Non pris en charge');
            console.log('🟣 assigned - Assigné');
            console.log('🟡 in_progress - En cours');
            console.log('🟠 on_hold - En attente');
            console.log('🟢 resolved - Résolu');

            // Créer quelques tickets de test avec le nouveau statut
            createTestTickets(db);
          });
        });
      });
    });
  });
};

const createTestTickets = (db) => {
  console.log('\n🧪 Création de tickets de test...');

  // Récupérer les IDs nécessaires
  db.get(`SELECT id FROM users WHERE role = 'technician' LIMIT 1`, (err, technician) => {
    if (err || !technician) {
      console.log('Aucun technicien trouvé pour les tests');
      db.close();
      return;
    }

    db.get(`SELECT id FROM users WHERE role = 'employee' LIMIT 1`, (err, employee) => {
      if (err || !employee) {
        console.log('Aucun employé trouvé pour les tests');
        db.close();
        return;
      }

      db.get(`SELECT id FROM services LIMIT 1`, (err, service) => {
        if (err || !service) {
          console.log('Aucun service trouvé pour les tests');
          db.close();
          return;
        }

        const testTickets = [
          {
            ticket_number: 'TICK-ASS-001',
            title: 'Ticket assigné - Test nouveau statut',
            description: 'Ticket directement assigné par le manager pour tester le nouveau statut',
            urgency: 'high',
            status: 'assigned',
            technician_id: technician.id
          },
          {
            ticket_number: 'TICK-HOLD-001',
            title: 'Ticket en attente - Test nouveau statut',
            description: 'Ticket en attente de pièces pour tester le nouveau statut',
            urgency: 'medium',
            status: 'on_hold',
            technician_id: technician.id
          }
        ];

        let created = 0;
        testTickets.forEach(ticket => {
          db.run(`
            INSERT OR IGNORE INTO tickets (ticket_number, title, description, urgency, status, service_id, employee_id, technician_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            ticket.ticket_number,
            ticket.title,
            ticket.description,
            ticket.urgency,
            ticket.status,
            service.id,
            employee.id,
            ticket.technician_id
          ], function(err) {
            created++;
            if (err) {
              console.log(`❌ Erreur création ticket ${ticket.ticket_number}:`, err.message);
            } else if (this.changes > 0) {
              console.log(`✅ Ticket créé: ${ticket.ticket_number} (${ticket.status})`);
            } else {
              console.log(`ℹ️ Ticket existe déjà: ${ticket.ticket_number}`);
            }

            if (created === testTickets.length) {
              console.log('\n🎉 Mise à jour terminée !');
              db.close();
            }
          });
        });
      });
    });
  });
};

// Exécuter la mise à jour
updateSchema();
