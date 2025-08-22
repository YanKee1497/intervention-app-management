const { db } = require('../database/init');

class Ticket {
  // Créer un nouveau ticket
  static create(ticketData, callback) {
    const { ticket_number, title, description, urgency, service_id, employee_id, attachment_path } = ticketData;
    const sql = `INSERT INTO tickets (ticket_number, title, description, urgency, service_id, employee_id, attachment_path) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [ticket_number, title, description, urgency, service_id, employee_id, attachment_path], function(err) {
      callback(err, this.lastID);
    });
  }

  // Générer un numéro de ticket unique
  static generateTicketNumber(serviceId, callback) {
    const year = new Date().getFullYear();
    const sql = `SELECT COUNT(*) as count FROM tickets WHERE service_id = ? AND strftime('%Y', created_at) = ?`;
    db.get(sql, [serviceId, year.toString()], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      
      // Obtenir le préfixe du service
      const servicePrefixes = {
        1: 'MAINT', // Maintenance
        2: 'INFO',  // Informatique
        3: 'LOG',   // Logistique
        4: 'NET',   // Nettoyage
        5: 'SEC'    // Sécurité
      };
      
      const prefix = servicePrefixes[serviceId] || 'GEN';
      const number = (row.count + 1).toString().padStart(4, '0');
      const ticketNumber = `${prefix}-${year}-${number}`;
      
      callback(null, ticketNumber);
    });
  }

  // Obtenir tous les tickets d'un employé
  static getByEmployee(employeeId, callback) {
    const sql = `
      SELECT t.*, s.name as service_name, s.icon as service_icon,
             u.firstname as technician_firstname, u.lastname as technician_lastname
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users u ON t.technician_id = u.id
      WHERE t.employee_id = ?
      ORDER BY t.created_at DESC
    `;
    db.all(sql, [employeeId], callback);
  }

  // Obtenir tous les tickets disponibles (non assignés)
  static getAvailable(callback) {
    const sql = `
      SELECT t.*, s.name as service_name, s.icon as service_icon,
             e.firstname as employee_firstname, e.lastname as employee_lastname
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users e ON t.employee_id = e.id
      WHERE t.status = 'pending'
      ORDER BY t.urgency DESC, t.created_at ASC
    `;
    db.all(sql, [], callback);
  }

  // Obtenir tous les tickets d'un technicien
  static getByTechnician(technicianId, callback) {
    const sql = `
      SELECT t.*, s.name as service_name, s.icon as service_icon,
             e.firstname as employee_firstname, e.lastname as employee_lastname
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users e ON t.employee_id = e.id
      WHERE t.technician_id = ?
      ORDER BY t.created_at DESC
    `;
    db.all(sql, [technicianId], callback);
  }

  // Obtenir tous les tickets (pour manager/admin)
  static getAll(callback) {
    const sql = `
      SELECT t.*, s.name as service_name, s.icon as service_icon,
             e.firstname as employee_firstname, e.lastname as employee_lastname,
             tech.firstname as technician_firstname, tech.lastname as technician_lastname
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users e ON t.employee_id = e.id
      LEFT JOIN users tech ON t.technician_id = tech.id
      ORDER BY t.created_at DESC
    `;
    db.all(sql, [], callback);
  }

  // Obtenir un ticket par ID
  static findById(id, callback) {
    const sql = `
      SELECT t.*, s.name as service_name, s.icon as service_icon,
             e.firstname as employee_firstname, e.lastname as employee_lastname, e.email as employee_email,
             tech.firstname as technician_firstname, tech.lastname as technician_lastname, tech.email as technician_email
      FROM tickets t
      LEFT JOIN services s ON t.service_id = s.id
      LEFT JOIN users e ON t.employee_id = e.id
      LEFT JOIN users tech ON t.technician_id = tech.id
      WHERE t.id = ?
    `;
    db.get(sql, [id], callback);
  }

  // Assigner un ticket à un technicien
  static assignToTechnician(ticketId, technicianId, callback) {
    const sql = `UPDATE tickets SET technician_id = ?, status = 'assigned', updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [technicianId, ticketId], callback);
  }

  // Prendre en charge un ticket (par un technicien)
  static takeOwnership(ticketId, technicianId, callback) {
    const sql = `UPDATE tickets SET technician_id = ?, status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'`;
    db.run(sql, [technicianId, ticketId], callback);
  }

  // Mettre à jour le statut d'un ticket
  static updateStatus(ticketId, status, callback) {
    let sql = `UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP`;
    let params = [status, ticketId];
    
    if (status === 'resolved') {
      sql += `, resolved_at = CURRENT_TIMESTAMP`;
    }
    
    sql += ` WHERE id = ?`;
    db.run(sql, params, callback);
  }

  // Obtenir les statistiques
  static getStats(callback) {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) as assigned,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        AVG(CASE WHEN resolved_at IS NOT NULL THEN 
          (julianday(resolved_at) - julianday(created_at)) * 24 
          ELSE NULL END) as avg_resolution_time_hours
      FROM tickets
      WHERE created_at >= date('now', '-30 days')
    `;
    db.get(sql, [], callback);
  }
}

module.exports = Ticket;
