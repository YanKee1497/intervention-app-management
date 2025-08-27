import React from 'react';
import './TicketDetailsModal.css';

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  const handleAddFile = () => {
    // Créer un input file temporaire
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif';
    
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const fileNames = files.map(f => f.name).join(', ');
        alert(`Fichier(s) ajouté(s) au ticket ${ticket.id}:\n${fileNames}`);
        console.log('Fichiers ajoutés:', files);
      }
    };
    
    input.click();
  };

  const handleAddComment = () => {
    const comment = prompt('Ajouter un commentaire au ticket:', '');
    if (comment && comment.trim()) {
      alert(`Commentaire ajouté au ticket ${ticket.id}:\n"${comment}"`);
      console.log('Commentaire ajouté:', { ticketId: ticket.id, comment });
    }
  };

  const handlePrintTicket = () => {
    // Simuler l'impression du ticket
    const printContent = `
      TICKET: ${ticket.id}
      Sujet: ${ticket.subject}
      Catégorie: ${ticket.category}
      Statut: ${getStatusText(ticket.status)}
      Date: ${new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
      
      Description:
      ${ticket.description || 'Aucune description'}
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Ticket ${ticket.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <pre>${printContent}</pre>
        </body>
      </html>
    `);
    printWindow.print();
    printWindow.close();
  };

  const handleExportTicket = () => {
    // Simuler l'export du ticket en JSON
    const ticketData = {
      ...ticket,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Utilisateur actuel'
    };
    
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`Ticket ${ticket.id} exporté avec succès !`);
  };

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
          <div className="footer-left">
            <button className="btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>
          <div className="footer-actions">
            <button 
              className="btn-outline"
              onClick={handleAddFile}
              title="Ajouter un fichier au ticket"
            >
              📎 Ajouter un fichier
            </button>
            <button 
              className="btn-outline"
              onClick={handleAddComment}
              title="Ajouter un commentaire"
            >
              💬 Ajouter un commentaire
            </button>
            <button 
              className="btn-outline"
              onClick={handlePrintTicket}
              title="Imprimer le ticket"
            >
              🖨️ Imprimer
            </button>
            <button 
              className="btn-outline"
              onClick={handleExportTicket}
              title="Exporter le ticket"
            >
              📤 Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
