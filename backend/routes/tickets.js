const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Créer un ticket (employés uniquement)
router.post('/', authorizeRoles('employee'), TicketController.createTicket);

// Obtenir les tickets selon le rôle
router.get('/', TicketController.getTickets);

// Obtenir les tickets disponibles (techniciens)
router.get('/available', authorizeRoles('technician'), TicketController.getAvailableTickets);

// Obtenir les statistiques (managers et admins)
router.get('/stats', authorizeRoles('manager', 'admin'), TicketController.getStats);

// Obtenir un ticket par ID
router.get('/:id', TicketController.getTicketById);

// Prendre en charge un ticket (techniciens)
router.put('/:id/take', authorizeRoles('technician'), TicketController.takeTicket);

// Assigner un ticket (managers et admins)
router.put('/:id/assign', authorizeRoles('manager', 'admin'), TicketController.assignTicket);

// Mettre à jour le statut d'un ticket
router.put('/:id/status', authorizeRoles('technician', 'manager', 'admin'), TicketController.updateTicketStatus);

module.exports = router;
