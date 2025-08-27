const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'intervention_app.db');

// Création de la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie.');
  }
});

// Création des tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Table des utilisateurs
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('employee', 'technician', 'manager', 'admin')),
      is_available BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Erreur création table users:', err);
        reject(err);
        return;
      }

      // Table des services
      db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Erreur création table services:', err);
          reject(err);
          return;
        }

        // Table des tickets/demandes
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
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
        )`, (err) => {
          if (err) {
            console.error('Erreur création table tickets:', err);
            reject(err);
            return;
          }

          // Table des commentaires/historique
          db.run(`CREATE TABLE IF NOT EXISTS ticket_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            comment TEXT NOT NULL,
            status_change TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES tickets (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          )`, (err) => {
            if (err) {
              console.error('Erreur création table ticket_comments:', err);
              reject(err);
              return;
            }

            // Table des notifications
            db.run(`CREATE TABLE IF NOT EXISTS notifications (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              ticket_id INTEGER NOT NULL,
              message TEXT NOT NULL,
              is_read BOOLEAN DEFAULT false,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users (id),
              FOREIGN KEY (ticket_id) REFERENCES tickets (id)
            )`, (err) => {
              if (err) {
                console.error('Erreur création table notifications:', err);
                reject(err);
                return;
              }

              // Insertion des services par défaut
              db.run(`INSERT OR IGNORE INTO services (id, name, description, icon) VALUES 
                (1, 'Maintenance', 'Réparations et maintenance générale', 'wrench'),
                (2, 'Informatique', 'Support technique informatique', 'computer'),
                (3, 'Logistique', 'Gestion des stocks et livraisons', 'truck'),
                (4, 'Nettoyage', 'Services de nettoyage et entretien', 'cleaning'),
                (5, 'Sécurité', 'Problèmes de sécurité et accès', 'shield')
              `, (err) => {
                if (err) {
                  console.error('Erreur insertion services par défaut:', err);
                  reject(err);
                  return;
                }

                console.log('Base de données initialisée avec succès.');
                resolve();
              });
            });
          });
        });
      });
    });
  });
};

module.exports = { db, initDatabase };
