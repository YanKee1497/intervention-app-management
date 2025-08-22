const { db } = require('../database/init');

class User {
  // Créer un nouvel utilisateur
  static create(userData, callback) {
    const { email, password, firstname, lastname, role } = userData;
    const sql = `INSERT INTO users (email, password, firstname, lastname, role) 
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [email, password, firstname, lastname, role], function(err) {
      callback(err, this.lastID);
    });
  }

  // Trouver un utilisateur par email
  static findByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], callback);
  }

  // Trouver un utilisateur par ID
  static findById(id, callback) {
    const sql = `SELECT id, email, firstname, lastname, role, is_available, created_at FROM users WHERE id = ?`;
    db.get(sql, [id], callback);
  }

  // Obtenir tous les techniciens
  static getTechnicians(callback) {
    const sql = `SELECT id, firstname, lastname, email, is_available FROM users WHERE role = 'technician'`;
    db.all(sql, [], callback);
  }

  // Obtenir tous les techniciens disponibles
  static getAvailableTechnicians(callback) {
    const sql = `SELECT id, firstname, lastname, email FROM users WHERE role = 'technician' AND is_available = true`;
    db.all(sql, [], callback);
  }

  // Mettre à jour la disponibilité d'un technicien
  static updateAvailability(id, isAvailable, callback) {
    const sql = `UPDATE users SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [isAvailable, id], callback);
  }

  // Obtenir tous les utilisateurs (pour admin)
  static getAll(callback) {
    const sql = `SELECT id, email, firstname, lastname, role, is_available, created_at FROM users ORDER BY created_at DESC`;
    db.all(sql, [], callback);
  }

  // Supprimer un utilisateur
  static delete(id, callback) {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [id], callback);
  }

  // Mettre à jour un utilisateur
  static update(id, userData, callback) {
    const { firstname, lastname, role, is_available } = userData;
    const sql = `UPDATE users SET firstname = ?, lastname = ?, role = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [firstname, lastname, role, is_available, id], callback);
  }
}

module.exports = User;
