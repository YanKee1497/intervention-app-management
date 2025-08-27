import React, { useState } from 'react';
import './NewTicketModal.css';

function NewTicketModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Support informatique',
    description: '',
    priority: 'Moyenne',
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Support informatique',
    'Réseau / Internet',
    'Matériel / Équipement',
    'Application interne',
    'Design 🎨',
    'Autre'
  ];

  const priorities = [
    'Faible',
    'Moyenne',
    'Urgente'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est obligatoire';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer un ID de ticket
      const ticketId = `TCK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Reset form
      setFormData({
        subject: '',
        category: 'Support informatique',
        description: '',
        priority: 'Moyenne',
        attachments: []
      });
      
      // Close modal
      onClose();
      
      // Show success notification (you can implement this in the parent component)
      alert(`✅ Votre demande a bien été enregistrée. Ticket ${ticketId} créé.`);
      
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      alert('❌ Une erreur est survenue lors de la création du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e) => {
    // Close modal only if clicking on overlay, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Créer une nouvelle demande</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            type="button"
            aria-label="Fermer"
          >
            ❌
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Informations principales */}
          <div className="form-section">
            <h3>Informations principales</h3>
            
            <div className="form-group">
              <label htmlFor="subject">Sujet / Titre de la demande *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={errors.subject ? 'error' : ''}
                placeholder="Décrivez brièvement votre demande"
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                rows="5"
                placeholder="Décrivez en détail votre demande, le problème rencontré ou vos besoins..."
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* Options supplémentaires */}
          <div className="form-section">
            <h3>Options supplémentaires</h3>
            
            <div className="form-group">
              <label>Priorité</label>
              <div className="radio-group">
                {priorities.map(priority => (
                  <label key={priority} className="radio-label">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    {priority}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Pièces jointes</label>
              <div 
                className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="file-upload-content">
                  <span className="file-upload-icon">📎</span>
                  <p>Glissez vos fichiers ici ou <span className="file-upload-link">choisissez un fichier</span></p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="file-input-hidden"
                  />
                </div>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span className="attachment-name">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="attachment-remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coordonnées employé */}
          <div className="form-section">
            <h3>Coordonnées employé</h3>
            <div className="employee-info">
              <div className="info-row">
                <label>Nom & prénom</label>
                <span>{user?.prenom} {user?.nom}</span>
              </div>
              <div className="info-row">
                <label>Service / département</label>
                <span>{user?.service || 'Non spécifié'}</span>
              </div>
              <div className="info-row">
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Création en cours...
                </>
              ) : (
                'Soumettre la demande'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTicketModal;
