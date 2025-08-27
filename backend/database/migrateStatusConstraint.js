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

async function updateStatusConstraint() {
  try {
    console.log('🔄 Mise à jour de la contrainte status pour inclure on_hold...');

    // Créer une nouvelle table avec la contrainte mise à jour
    await new Promise((resolve, reject) => {
      db.run(`CREATE TABLE tickets_new (
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
          console.error('Erreur lors de la création de la nouvelle table:', err);
          reject(err);
        } else {
          console.log('✅ Nouvelle table tickets_new créée');
          resolve();
        }
      });
    });

    // Copier les données existantes
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO tickets_new 
        SELECT * FROM tickets`, (err) => {
        if (err) {
          console.error('Erreur lors de la copie des données:', err);
          reject(err);
        } else {
          console.log('✅ Données copiées dans la nouvelle table');
          resolve();
        }
      });
    });

    // Supprimer l'ancienne table
    await new Promise((resolve, reject) => {
      db.run(`DROP TABLE tickets`, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de l\'ancienne table:', err);
          reject(err);
        } else {
          console.log('✅ Ancienne table supprimée');
          resolve();
        }
      });
    });

    // Renommer la nouvelle table
    await new Promise((resolve, reject) => {
      db.run(`ALTER TABLE tickets_new RENAME TO tickets`, (err) => {
        if (err) {
          console.error('Erreur lors du renommage:', err);
          reject(err);
        } else {
          console.log('✅ Table renommée avec succès');
          resolve();
        }
      });
    });

    console.log('🎉 Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// Lancer la migration
updateStatusConstraint().then(() => {
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err.message);
    } else {
      console.log('✨ Base de données fermée correctement.');
    }
  });
});
