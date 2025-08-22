const { db } = require('../database/init');

class Service {
  // Obtenir tous les services
  static getAll(callback) {
    const sql = `SELECT * FROM services ORDER BY name`;
    db.all(sql, [], callback);
  }

  // Obtenir un service par ID
  static findById(id, callback) {
    const sql = `SELECT * FROM services WHERE id = ?`;
    db.get(sql, [id], callback);
  }

  // Créer un nouveau service
  static create(serviceData, callback) {
    const { name, description, icon } = serviceData;
    const sql = `INSERT INTO services (name, description, icon) VALUES (?, ?, ?)`;
    db.run(sql, [name, description, icon], function(err) {
      callback(err, this.lastID);
    });
  }

  // Mettre à jour un service
  static update(id, serviceData, callback) {
    const { name, description, icon } = serviceData;
    const sql = `UPDATE services SET name = ?, description = ?, icon = ? WHERE id = ?`;
    db.run(sql, [name, description, icon, id], callback);
  }

  // Supprimer un service
  static delete(id, callback) {
    const sql = `DELETE FROM services WHERE id = ?`;
    db.run(sql, [id], callback);
  }

  // Obtenir les statistiques par service
  static getStatsById(id, callback) {
    const sql = `
      SELECT 
        s.name,
        COUNT(t.id) as total_tickets,
        SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN t.status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        AVG(CASE WHEN t.resolved_at IS NOT NULL THEN 
          (julianday(t.resolved_at) - julianday(t.created_at)) * 24 
          ELSE NULL END) as avg_resolution_time_hours
      FROM services s
      LEFT JOIN tickets t ON s.id = t.service_id
      WHERE s.id = ?
      GROUP BY s.id, s.name
    `;
    db.get(sql, [id], callback);
  }
}

module.exports = Service;
