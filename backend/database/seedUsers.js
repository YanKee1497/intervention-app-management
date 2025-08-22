const bcrypt = require('bcryptjs');
const { db } = require('../database/init');

const createTestUsers = async () => {
  try {
    // Mot de passe par défaut pour tous les utilisateurs de test
    const defaultPassword = await bcrypt.hash('password123', 12);
    
    const testUsers = [
      {
        email: 'admin@entreprise.com',
        password: defaultPassword,
        firstname: 'Admin',
        lastname: 'Système',
        role: 'admin'
      },
      {
        email: 'manager@entreprise.com',
        password: defaultPassword,
        firstname: 'Jean',
        lastname: 'Dupont',
        role: 'manager'
      },
      {
        email: 'technicien1@entreprise.com',
        password: defaultPassword,
        firstname: 'Pierre',
        lastname: 'Martin',
        role: 'technician'
      },
      {
        email: 'technicien2@entreprise.com',
        password: defaultPassword,
        firstname: 'Marie',
        lastname: 'Durand',
        role: 'technician'
      },
      {
        email: 'employe1@entreprise.com',
        password: defaultPassword,
        firstname: 'Sophie',
        lastname: 'Bernard',
        role: 'employee'
      },
      {
        email: 'employe2@entreprise.com',
        password: defaultPassword,
        firstname: 'Thomas',
        lastname: 'Moreau',
        role: 'employee'
      }
    ];

    for (const user of testUsers) {
      db.run(`INSERT OR IGNORE INTO users (email, password, firstname, lastname, role) 
              VALUES (?, ?, ?, ?, ?)`,
        [user.email, user.password, user.firstname, user.lastname, user.role],
        function(err) {
          if (err) {
            console.error(`Erreur lors de la création de ${user.email}:`, err);
          } else {
            console.log(`✅ Utilisateur créé: ${user.email} (${user.role})`);
          }
        }
      );
    }

    console.log('\n📋 Comptes de test créés:');
    console.log('==========================================');
    console.log('👑 Admin: admin@entreprise.com / password123');
    console.log('👔 Manager: manager@entreprise.com / password123');
    console.log('🔧 Technicien 1: technicien1@entreprise.com / password123');
    console.log('🔧 Technicien 2: technicien2@entreprise.com / password123');
    console.log('👤 Employé 1: employe1@entreprise.com / password123');
    console.log('👤 Employé 2: employe2@entreprise.com / password123');
    console.log('==========================================\n');

  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs de test:', error);
  }
};

module.exports = { createTestUsers };
