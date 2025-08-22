const Ticket = require('../models/Ticket');
const User = require('../models/User');

class TicketController {
  // Créer un nouveau ticket
  static createTicket(req, res) {
    const { title, description, urgency, service_id, attachment_path } = req.body;

    if (!title || !description || !urgency || !service_id) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés' });
    }

    // Générer le numéro de ticket
    Ticket.generateTicketNumber(service_id, (err, ticketNumber) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la génération du numéro de ticket' });
      }

      const ticketData = {
        ticket_number: ticketNumber,
        title,
        description,
        urgency,
        service_id,
        employee_id: req.user.userId,
        attachment_path
      };

      Ticket.create(ticketData, (err, ticketId) => {
        if (err) {
          console.error('Erreur lors de la création du ticket:', err);
          return res.status(500).json({ error: 'Erreur lors de la création du ticket' });
        }

        // Obtenir le nombre de techniciens disponibles
        User.getAvailableTechnicians((err, availableTechnicians) => {
          if (err) {
            console.error('Erreur lors de la récupération des techniciens:', err);
          }

          res.status(201).json({
            message: 'Ticket créé avec succès',
            ticketId,
            ticketNumber,
            availableTechnicians: availableTechnicians ? availableTechnicians.length : 0
          });
        });
      });
    });
  }

  // Obtenir les tickets selon le rôle de l'utilisateur
  static getTickets(req, res) {
    const { role, userId } = req.user;

    switch (role) {
      case 'employee':
        Ticket.getByEmployee(userId, (err, tickets) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
          }
          res.json(tickets);
        });
        break;

      case 'technician':
        Ticket.getByTechnician(userId, (err, tickets) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
          }
          res.json(tickets);
        });
        break;

      case 'manager':
      case 'admin':
        Ticket.getAll((err, tickets) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
          }
          res.json(tickets);
        });
        break;

      default:
        res.status(403).json({ error: 'Accès interdit' });
    }
  }

  // Obtenir les tickets disponibles (pour les techniciens)
  static getAvailableTickets(req, res) {
    if (req.user.role !== 'technician') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    Ticket.getAvailable((err, tickets) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
      }
      res.json(tickets);
    });
  }

  // Prendre en charge un ticket (technicien)
  static takeTicket(req, res) {
    const { id } = req.params;

    if (req.user.role !== 'technician') {
      return res.status(403).json({ error: 'Seuls les techniciens peuvent prendre en charge des tickets' });
    }

    Ticket.takeOwnership(id, req.user.userId, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la prise en charge du ticket' });
      }

      if (this.changes === 0) {
        return res.status(400).json({ error: 'Ticket déjà assigné ou inexistant' });
      }

      res.json({ message: 'Ticket pris en charge avec succès' });
    });
  }

  // Assigner un ticket à un technicien (manager/admin)
  static assignTicket(req, res) {
    const { id } = req.params;
    const { technician_id } = req.body;

    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    if (!technician_id) {
      return res.status(400).json({ error: 'ID du technicien requis' });
    }

    Ticket.assignToTechnician(id, technician_id, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'assignation du ticket' });
      }

      res.json({ message: 'Ticket assigné avec succès' });
    });
  }

  // Mettre à jour le statut d'un ticket
  static updateTicketStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Statut requis' });
    }

    const validStatuses = ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    // Vérifier les permissions
    if (req.user.role === 'employee') {
      return res.status(403).json({ error: 'Les employés ne peuvent pas modifier le statut des tickets' });
    }

    Ticket.updateStatus(id, status, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
      }

      res.json({ message: 'Statut mis à jour avec succès' });
    });
  }

  // Obtenir un ticket par ID
  static getTicketById(req, res) {
    const { id } = req.params;

    Ticket.findById(id, (err, ticket) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération du ticket' });
      }

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket non trouvé' });
      }

      // Vérifier les permissions
      if (req.user.role === 'employee' && ticket.employee_id !== req.user.userId) {
        return res.status(403).json({ error: 'Accès interdit à ce ticket' });
      }

      if (req.user.role === 'technician' && 
          ticket.technician_id !== req.user.userId && 
          ticket.status === 'pending') {
        // Les techniciens peuvent voir les tickets disponibles et leurs propres tickets
      }

      res.json(ticket);
    });
  }

  // Obtenir les statistiques
  static getStats(req, res) {
    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    Ticket.getStats((err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
      }

      res.json(stats);
    });
  }
}

module.exports = TicketController;
