import React, { useState } from 'react';
import './NewTicketModal.css';

const NewTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'medium',
    service: 'Informatique',
    employee_firstname: '',
    employee_lastname: '',
    employee_email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newTicket = {
        id: Date.now(), // ID temporaire
        ticket_number: `TCK-${String(Date.now()).slice(-3)}`,
        title: formData.title,
        description: formData.description,
        urgency: formData.urgency,
        status: 'pending',
        service: { name: formData.service },
        employee: {
          firstname: formData.employee_firstname,
          lastname: formData.employee_lastname,
          email: formData.employee_email
        },
        technician: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await onSubmit(newTicket);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        urgency: 'medium',
        service: 'Informatique',
        employee_firstname: '',
        employee_lastname: '',
        employee_email: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      alert('Erreur lors de la création du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎫 Créer un nouveau ticket</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-section">
            <h3>📋 Informations du ticket</h3>
            
            <div className="form-group">
              <label htmlFor="title">Titre du ticket *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Décrivez brièvement le problème..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgency">Priorité</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="low">🟢 Basse</option>
                  <option value="medium">🟡 Moyenne</option>
                  <option value="high">🟠 Haute</option>
                  <option value="critical">🔴 Critique</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="service">Service</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="Informatique">💻 Informatique</option>
                  <option value="Maintenance">🔧 Maintenance</option>
                  <option value="Formation">📚 Formation</option>
                  <option value="Support">📞 Support</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description détaillée *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez le problème en détail..."
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>👤 Informations du demandeur</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employee_firstname">Prénom</label>
                <input
                  type="text"
                  id="employee_firstname"
                  name="employee_firstname"
                  value={formData.employee_firstname}
                  onChange={handleInputChange}
                  placeholder="Prénom du demandeur"
                />
              </div>

              <div className="form-group">
                <label htmlFor="employee_lastname">Nom</label>
                <input
                  type="text"
                  id="employee_lastname"
                  name="employee_lastname"
                  value={formData.employee_lastname}
                  onChange={handleInputChange}
                  placeholder="Nom du demandeur"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="employee_email">Email</label>
              <input
                type="email"
                id="employee_email"
                name="employee_email"
                value={formData.employee_email}
                onChange={handleInputChange}
                placeholder="email@entreprise.com"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : '✅ Créer le ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;
