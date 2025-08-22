import React, { useState } from 'react';
import { ticketService } from '../services/api';
import '../styles/Modal.css';

const CreateTicketModal = ({ services, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'medium',
    service_id: '',
    attachment_path: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.service_id) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ticketService.createTicket(formData);
      
      // Afficher une notification de succès
      alert(`Ticket créé avec succès! 
Numéro: ${response.ticketNumber}
${response.availableTechnicians} technicien(s) disponible(s) pour traiter votre demande.`);
      
      onTicketCreated();
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nouvelle demande d'intervention</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-ticket-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="service_id">Service concerné *</label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Titre de la demande *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Problème d'imprimante au bureau 205"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description détaillée *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez précisément le problème rencontré..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Niveau d'urgence</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Faible - Peut attendre</option>
              <option value="medium">Moyen - Dans les prochains jours</option>
              <option value="high">Élevé - Urgent</option>
              <option value="critical">Critique - Intervention immédiate</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="attachment">Pièce jointe (optionnel)</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept="image/*,.pdf,.doc,.docx"
            />
            <small>Formats acceptés: images, PDF, documents Word</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
