import React from 'react';
import './TicketDetailsModal.css';

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'normal': return '#059669';
      case 'faible': return '#6b7280';
      default: return '#059669';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'normal': return 'Normal';
      case 'faible': return 'Faible';
      default: return 'Normal';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      en_attente: 'En attente',
      en_cours: 'En cours',
      resolu: 'Résolu',
      non_pris_en_charge: 'Non pris en charge'
    };
    return statusMap[status] || status;
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'Support': 'Support',
      'Bug': 'Bug',
      'Installation': 'Installation'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="ticket-details-overlay" onClick={onClose}>
      <div className="ticket-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ticket-details-header">
          <div className="ticket-details-title">
            <h2>Détails du ticket</h2>
            <span className="ticket-id-badge">{ticket.id}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="ticket-details-body">
          {/* Subject */}
          <div className="detail-section">
            <label className="detail-label">Sujet</label>
            <div className="detail-value">{ticket.subject}</div>
          </div>

          {/* Info Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <label className="detail-label">Catégorie</label>
              <div className="detail-value">
                <span className="category-badge">
                  {getCategoryText(ticket.category)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <label className="detail-label">Statut</label>
              <div className="detail-value">
                <span className={`status-badge status-${ticket.status.replace('_', '-')}`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <label className="detail-label">Priorité</label>
              <div className="detail-value">
                <span 
                  className="priority-badge"
                  style={{ color: getPriorityColor(ticket.priority) }}
                >
                  ● {getPriorityText(ticket.priority)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <label className="detail-label">Date de création</label>
              <div className="detail-value">
                {new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Description section (if available) */}
          {ticket.description && (
            <div className="detail-section">
              <label className="detail-label">Description</label>
              <div className="detail-value description-text">
                {ticket.description}
              </div>
            </div>
          )}

          {/* Timeline section */}
          <div className="detail-section">
            <label className="detail-label">Historique</label>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot created"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Ticket créé</div>
                  <div className="timeline-date">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')} à{' '}
                    {new Date().toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {ticket.status === 'en_cours' && (
                <div className="timeline-item">
                  <div className="timeline-dot in-progress"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Pris en charge</div>
                    <div className="timeline-date">En cours de traitement</div>
                  </div>
                </div>
              )}

              {ticket.status === 'resolu' && (
                <div className="timeline-item">
                  <div className="timeline-dot resolved"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Ticket résolu</div>
                    <div className="timeline-date">Résolution terminée</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ticket-details-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
          <div className="footer-actions">
            <button className="btn-outline">
              📎 Ajouter un fichier
            </button>
            <button className="btn-outline">
              💬 Ajouter un commentaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
