const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Obtenir tous les services
router.get('/', (req, res) => {
  Service.getAll((err, services) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des services' });
    }
    res.json(services);
  });
});

// Obtenir un service par ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  Service.findById(id, (err, service) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération du service' });
    }
    
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    
    res.json(service);
  });
});

// Créer un nouveau service (admins uniquement)
router.post('/', authorizeRoles('admin'), (req, res) => {
  const { name, description, icon } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Le nom du service est requis' });
  }
  
  const serviceData = { name, description, icon };
  
  Service.create(serviceData, (err, serviceId) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la création du service' });
    }
    
    res.status(201).json({
      message: 'Service créé avec succès',
      serviceId
    });
  });
});

// Mettre à jour un service (admins uniquement)
router.put('/:id', authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const { name, description, icon } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Le nom du service est requis' });
  }
  
  const serviceData = { name, description, icon };
  
  Service.update(id, serviceData, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du service' });
    }
    
    res.json({ message: 'Service mis à jour avec succès' });
  });
});

// Supprimer un service (admins uniquement)
router.delete('/:id', authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  
  Service.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la suppression du service' });
    }
    
    res.json({ message: 'Service supprimé avec succès' });
  });
});

// Obtenir les statistiques d'un service (managers et admins)
router.get('/:id/stats', authorizeRoles('manager', 'admin'), (req, res) => {
  const { id } = req.params;
  
  Service.getStatsById(id, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
    
    res.json(stats);
  });
});

module.exports = router;
