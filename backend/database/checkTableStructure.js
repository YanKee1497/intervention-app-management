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

// Vérifier la structure de la table tickets
db.all("PRAGMA table_info(tickets)", (err, rows) => {
  if (err) {
    console.error('Erreur:', err);
  } else {
    console.log('Structure de la table tickets:');
    console.log('=====================================');
    rows.forEach(row => {
      console.log(`${row.name} (${row.type}) - ${row.notnull ? 'NOT NULL' : 'NULL'} - ${row.dflt_value || 'No default'}`);
    });
  }
  
  db.close();
});
