const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

// Migration pour ajouter le statut 'on_hold'
const migrationSQL = `
-- Créer une nouvelle table temporaire avec les nouveaux statuts
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

-- Copier les données existantes
INSERT INTO tickets_new SELECT * FROM tickets;

-- Supprimer l'ancienne table
DROP TABLE tickets;

-- Renommer la nouvelle table
ALTER TABLE tickets_new RENAME TO tickets;
`;

const runMigration = async () => {
  const db = new sqlite3.Database(dbPath);
  
  try {
    console.log('🔄 Début de la migration des statuts...');
    
    // Exécuter les requêtes de migration une par une
    const queries = migrationSQL.split(';').filter(q => q.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await new Promise((resolve, reject) => {
          db.run(query, (err) => {
            if (err) {
              console.error('Erreur lors de la migration:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }
    
    console.log('✅ Migration terminée avec succès !');
    console.log('📊 Nouveaux statuts disponibles :');
    console.log('   🔴 pending (Non pris en charge)');
    console.log('   🟣 assigned (Assigné)');
    console.log('   🟡 in_progress (En cours)');
    console.log('   🟠 on_hold (En attente)');
    console.log('   🟢 resolved (Résolu)');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    db.close();
  }
};

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
